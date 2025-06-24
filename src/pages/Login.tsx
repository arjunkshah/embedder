"use client";

import React, { useState,useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useToast } from "@/components/ui/use-toast";

import * as THREE from "three";

// --- Framer-motion + R3F Canvas Effect ---
type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface SignInPageProps {
  className?: string;
  mode: "signin" | "signup";
}
      
export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}>
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};
    
interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "", 
  center = ["x", "y"],
}) => {
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;
        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);
            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));
            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));
            vec3 color = u_colors[int(show_offset * 6.0)];
            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};


const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();
    const material: any = ref.current.material;
    material.uniforms.u_time.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};
    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];
      switch (uniform.type) {
        case "uniform1f": preparedUniforms[uniformName] = { value: uniform.value, type: "1f" }; break;
        case "uniform1i": preparedUniforms[uniformName] = { value: uniform.value, type: "1i" }; break;
        case "uniform3f": preparedUniforms[uniformName] = { value: new THREE.Vector3().fromArray(uniform.value), type: "3f" }; break;
        case "uniform1fv": preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" }; break;
        case "uniform3fv": preparedUniforms[uniformName] = { value: uniform.value.map((v: number[]) => new THREE.Vector3().fromArray(v)), type: "3fv" }; break;
        case "uniform2f": preparedUniforms[uniformName] = { value: new THREE.Vector2().fromArray(uniform.value), type: "2f" }; break;
        default: console.error(`Invalid uniform type for '${uniformName}'.`); break;
      }
    }
    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = { value: new THREE.Vector2(size.width * 2, size.height * 2) };
    return preparedUniforms;
  };

  const material = useMemo(() => new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    }), [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<{ source: string, uniforms: Uniforms, maxFps?: number }> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

// --- Auth Page Component ---

export const AuthPage = ({ className, mode }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isSubmitting) return;

    setIsSubmitting(true);
    const endpoint = mode === 'signin' ? '/api/login' : '/api/register';
    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({ title: mode === 'signin' ? "Login Successful" : "Registration Successful" });
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        toast({
          title: "Authentication Failed",
          description: data.message || "An error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "A network error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex w-full flex-col min-h-screen bg-black relative", className)}>
      <div className="absolute inset-0 z-0">
        <CanvasRevealEffect
          animationSpeed={3}
          containerClassName="bg-black"
          colors={[[255, 255, 255], [255, 255, 255]]}
          dotSize={2}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex flex-1 flex-col justify-center items-center">
          <div className="w-full mt-12 max-w-sm px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-6 text-center"
              >
                <div className="space-y-1">
                  <h1 className="text-4xl font-bold tracking-tight text-white">
                    {mode === 'signin' ? 'Sign In' : 'Create an Account'}
                  </h1>
                  <p className="text-lg text-white/70 font-light">
                    {mode === 'signin' ? 'Welcome back! Enter your details.' : 'Get started by creating your account.'}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-neutral-900/50 text-white placeholder:text-neutral-400 border border-neutral-700 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center"
                    required
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-900/50 text-white placeholder:text-neutral-400 border border-neutral-700 rounded-full py-3 px-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-black py-3 px-4 rounded-full bg-white hover:bg-neutral-200 disabled:bg-neutral-400/50 disabled:text-neutral-700 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {isSubmitting ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                  </button>
                </form>
                <p className="text-sm text-neutral-400">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}{' '}
                  <Link to={mode === 'signin' ? '/register' : '/login'} className="text-cyan-500 hover:text-cyan-400 underline font-semibold">
                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </Link>
                </p>
                <p className="text-xs text-white/40 pt-10">
                  By signing up, you agree to the MSA, Product Terms, Policies, Privacy Notice, and Cookie Notice.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  return <AuthPage mode="signin" />;
};

export default Login;
