import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Check, Settings, Presentation, Code, MoveRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Rnd } from "react-rnd";
import { Helmet, HelmetProvider } from "react-helmet-async";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    tiktok?: {
      embed: {
        render: () => void;
      };
    };
  }
}

const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(568); // 9:16 aspect ratio
  const [position, setPosition] = useState("center");
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [embedCode, setEmbedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [embedCount, setEmbedCount] = useState(3);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState("");
  const [previewVideoId, setPreviewVideoId] = useState("");

  const isVerticalVideo = ["youtube", "tiktok", "instagram"].includes(previewPlatform);

  useEffect(() => {
    const storedEmbeds = localStorage.getItem("embeds");
    if (storedEmbeds) {
      setEmbedCount(JSON.parse(storedEmbeds).length);
    }
  }, []);
  
  useEffect(() => {
    if (!showPreview) return;

    if (previewPlatform === "instagram") {
      window.instgrm?.Embeds.process();
    }
    if (previewPlatform === "tiktok") {
      window.tiktok?.embed.render();
    }
  }, [width, height, position, autoplay, controls, showPreview, previewPlatform]);


  const generateEmbedCode = (isNew = true, save = true) => {
    if (!videoUrl && isNew) return;

    let videoId = previewVideoId;
    let platform = previewPlatform;
    const justify = position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center";

    if (isNew) {
      if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
        platform = "youtube";
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/;
        const match = videoUrl.match(regExp);
        videoId = match && match[8].length === 11 ? match[8] : "";
      } else if (videoUrl.includes("tiktok.com")) {
        platform = "tiktok";
        const regExp = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
        const match = videoUrl.match(regExp);
        videoId = match ? match[1] : "";
      } else if (videoUrl.includes("instagram.com")) {
        platform = "instagram";
        const regExp = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
        const match = videoUrl.match(regExp);
        videoId = match ? match[1] : "";
      } else if (videoUrl.includes("slideshare.net") || videoUrl.includes("slides.com") || videoUrl.includes("docs.google.com/presentation")) {
        platform = "slides";
        videoId = videoUrl;
      }

      if (!videoId) {
        alert("Please enter a valid YouTube, TikTok, Instagram, or Slides URL");
        return;
      }

      setPreviewPlatform(platform);
      setPreviewVideoId(videoId);
      setShowPreview(true);
      if (isNew && save) setEmbedCount(prev => prev + 1);
    }

    let html = "";
    const autoplayParam = autoplay ? "1" : "0";
    const controlsParam = controls ? "0" : "1";

    if (platform === "youtube") {
      const iframeHeight = width * (16 / 9);
      html = `<div style="display:flex; justify-content:${justify}; width:100%;"><div style="width:${width}px; height:${height}px; overflow:hidden; position:relative; background-color:#000;"><iframe src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplayParam}&controls=${controlsParam}&showinfo=0&rel=0&modestbranding=1" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:${width}px; height:${iframeHeight}px;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>`;
    } else if (platform === "tiktok") {
      html = `<div style="display:flex;justify-content:${justify};width:100%;"><blockquote class="tiktok-embed" cite="https://www.tiktok.com/t/${videoId}" data-video-id="${videoId}" style="width:${width}px; height:${height}px;"></blockquote><script async src="https://www.tiktok.com/embed.js"></script></div>`;
    } else if (platform === "instagram") {
      html = `<div style="display:flex;justify-content:${justify};width:100%;"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${videoId}/" style="width:${width}px;"></blockquote><script async src="//www.instagram.com/embed.js"></script></div>`;
    } else if (platform === "slides") {
      let slidesSrc = videoId.includes("docs.google.com") ? videoId.replace("/edit", "/embed") : videoId;
      html = `<div style="display: flex; justify-content: ${justify}; width: 100%;"><iframe width="${width}" height="${height}" src="${slidesSrc}" title="Slides presentation" frameborder="0" allowfullscreen></iframe></div>`;
    }

    setEmbedCode(html);
    
    if (save) {
      try {
        const stored = JSON.parse(localStorage.getItem("embeds") || "[]");
        stored.unshift({ url: videoUrl, code: html, date: new Date().toISOString() });
        localStorage.setItem("embeds", JSON.stringify(stored.slice(0, 50)));
      } catch {
        localStorage.setItem("embeds", JSON.stringify([{ url: videoUrl, code: html, date: new Date().toISOString() }]));
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    if (!showPreview) {
      generateEmbedCode(true, false);
      setShowCode(false);
    } else {
      generateEmbedCode(false, true);
      setShowCode(true);
    }
  };

  const renderPreview = () => {
    if (!showPreview || !previewVideoId) return null;

    if (previewPlatform === 'youtube') {
      const autoplayParam = autoplay ? "1" : "0";
      const controlsParam = controls ? "0" : "1";
      const iframeHeight = width * (16 / 9);

      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#000",
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=${autoplayParam}&controls=${controlsParam}&showinfo=0&rel=0&modestbranding=1`}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${width}px`,
              height: `${iframeHeight}px`,
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    if (previewPlatform === 'instagram') {
      return (
        <>
          <Helmet>
            <script async src="//www.instagram.com/embed.js" />
          </Helmet>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={`https://www.instagram.com/p/${previewVideoId}/`}
            style={{ width: '100%' }}
          />
        </>
      );
    }
    
    if (previewPlatform === 'tiktok') {
        return (
            <>
                <Helmet>
                    <script async src="https://www.tiktok.com/embed.js"/>
                </Helmet>
                <blockquote
                    className="tiktok-embed"
                    cite={`https://www.tiktok.com/t/${previewVideoId}`}
                    data-video-id={previewVideoId}
                    style={{width: '100%', height: '100%'}}
                >
                </blockquote>
            </>
        )
    }

    if (previewPlatform === "slides") {
      let slidesSrc = previewVideoId.includes("docs.google.com") ? previewVideoId.replace("/edit", "/embed") : previewVideoId;
      return <iframe width="100%" height="100%" src={slidesSrc} title="Slides presentation" frameBorder="0" allowFullScreen />;
    }

    return null;
  };

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-900 text-white font-sans">
        <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <a href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </a>
          <div className="w-px h-6 bg-gray-700" />
          <h1 className="text-xl font-semibold tracking-tight">EmbedGen</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {embedCount}/10 embeds used
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a href="/embeds">Past Embeds</a>
          </Button>
          <Button size="sm" className="bg-white text-black hover:bg-gray-200">
            Upgrade Pro
          </Button>
        </div>
      </header>
        
        <div className="flex" style={{ height: "calc(100vh - 65px)" }}>
          {/* Left Sidebar */}
          <aside className="w-[350px] p-6 border-r border-gray-800 space-y-6 overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="content-url" className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Content URL
              </Label>
              <Input
                id="content-url"
                type="url"
                placeholder="Paste YouTube, TikTok, Instagram..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-gray-800 border-gray-700 focus:ring-blue-500 text-sm"
              />
              <p className="text-xs text-gray-500">Supports: YouTube, TikTok, Instagram Reels, Google Slides</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400">Dimensions</h3>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width" className="text-xs">Width ({width}px)</Label>
                    <Slider id="width" min={200} max={1200} step={2} value={[width]} onValueChange={([val]) => setWidth(val)} />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Height ({height}px)</Label>
                    <Slider id="height" min={150} max={1000} step={2} value={[height]} onValueChange={([val]) => setHeight(val)} />
                  </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-medium text-gray-400">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-sm">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400">Options</h3>
              <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md">
                <Label htmlFor="autoplay" className="font-normal text-sm">Autoplay (YouTube/Slides)</Label>
                <Switch id="autoplay" checked={autoplay} onCheckedChange={setAutoplay} />
              </div>
              <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-md">
                <Label htmlFor="controls" className="font-normal text-sm">Show controls</Label>
                <Switch id="controls" checked={controls} onCheckedChange={setControls} />
              </div>
            </div>
            
            <Button onClick={handleGenerate} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity flex items-center gap-2">
              Generate Embed <MoveRight className="w-4 h-4" />
            </Button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6 flex flex-col bg-black/20">
              <div className="flex-1 rounded-lg flex items-center justify-center relative bg-grid-gray-800/[0.2]">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

                  {showPreview ? (
                    <Rnd
                      size={{ width, height }}
                      onResize={(e, direction, ref, delta, position) => {
                        setWidth(parseInt(ref.style.width));
                        setHeight(parseInt(ref.style.height));
                      }}
                      className="flex items-center justify-center border border-dashed border-gray-700"
                      lockAspectRatio={isVerticalVideo ? 9 / 16 : undefined}
                    >
                    {renderPreview()}
                    </Rnd>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Presentation className="h-8 w-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Ready to Generate</h2>
                      <p className="text-gray-400 mt-2">Paste a URL to see a preview of your embed</p>
                    </div>
                  )}
              </div>

              {showCode && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2"><Code className="w-5 h-5"/>Embed Code</h3>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy Code'}
                      </Button>
                    </div>
                    <pre className="bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                      <code className="font-mono">{embedCode}</code>
                    </pre>
                  </div>
              )}
          </main>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default Dashboard; 