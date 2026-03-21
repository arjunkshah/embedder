import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";

type AuthMode = "login" | "register";

interface SignInPageProps {
  className?: string;
  mode?: AuthMode;
}

export const SignInPage = ({ className = "", mode = "login" }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";
  const heading = useMemo(() => (isLogin ? "Welcome back" : "Create your account"), [isLogin]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className={`relative min-h-screen overflow-hidden bg-background text-foreground ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--brand)/0.22),transparent_35%),radial-gradient(circle_at_80%_0%,hsl(var(--brand)/0.20),transparent_30%),linear-gradient(180deg,hsl(240_20%_7%),hsl(240_15%_5%))]" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-brand/50 bg-brand/20 text-brand">E</span>
            EmbedGen
          </Link>
          <div className="space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/15 px-3 py-1 text-xs text-brand">
              <Sparkles className="h-3.5 w-3.5" />
              Studio-grade embed workflow
            </p>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
              Build beautiful short-form video experiences in minutes.
            </h1>
            <p className="max-w-lg text-muted-foreground">
              Tweak dimensions, behavior, and placement visually. Then copy optimized embed code straight into your site.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="mb-6 space-y-2">
            <h2 className="text-2xl font-semibold">{heading}</h2>
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Sign in to continue to your dashboard." : "Start your free workspace and publish faster."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="h-11 border-border/80 bg-background/70 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="h-11 border-border/80 bg-background/70 pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="h-11 w-full bg-brand text-brand-foreground hover:bg-brand/90">
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isLogin ? "New to EmbedGen?" : "Already have an account?"}{" "}
            <Link to={isLogin ? "/register" : "/login"} className="text-brand hover:underline">
              {isLogin ? "Create one" : "Sign in"}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};
