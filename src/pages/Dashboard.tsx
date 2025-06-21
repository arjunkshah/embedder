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
import { Link } from "react-router-dom";
import { plans, getUserPlan, setUserPlan } from "@/lib/plans";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [embedCount, setEmbedCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState("");
  const [previewVideoId, setPreviewVideoId] = useState("");
  const [userPlan, setUserPlanState] = useState(getUserPlan());
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isVerticalVideo = ["youtube", "tiktok", "instagram"].includes(previewPlatform);
  const isEmbedLimitReached = embedCount >= userPlan.limit;

  useEffect(() => {
    const storedEmbeds = localStorage.getItem("embeds");
    if (storedEmbeds) {
      setEmbedCount(JSON.parse(storedEmbeds).length);
    }

    const handleStorageChange = () => {
      setUserPlanState(getUserPlan());
      const updatedStoredEmbeds = localStorage.getItem("embeds");
      if (updatedStoredEmbeds) {
        setEmbedCount(JSON.parse(updatedStoredEmbeds).length);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
        let tempUrl = videoUrl;
        if (tempUrl.includes("/shorts/")) {
          tempUrl = tempUrl.replace("/shorts/", "/embed/");
        }
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = tempUrl.match(regExp);
        videoId = (match && match[2].length === 11) ? match[2] : "";
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
      if (isNew && save) {
        if (isEmbedLimitReached) {
          setShowUpgradeModal(true);
          return;
        }
        setEmbedCount(prev => prev + 1);
      }
    }

    let html = "";
    const autoplayParam = autoplay ? "1" : "0";
    const controlsParam = controls ? "1" : "0";

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
        if (isEmbedLimitReached && !stored.find(item => item.code === html)) {
          return;
        }
        
        if (!stored.find(item => item.code === html)) {
            stored.unshift({ url: videoUrl, code: html, date: new Date().toISOString() });
            localStorage.setItem("embeds", JSON.stringify(stored.slice(0, 50)));
            setEmbedCount(stored.length);
        }
      } catch {
        localStorage.setItem("embeds", JSON.stringify([{ url: videoUrl, code: html, date: new Date().toISOString() }]));
        setEmbedCount(1);
      }
    }
  };

  const resetToDefault = () => {
    setShowPreview(false);
    setShowCode(false);
    setVideoUrl("");
    setWidth(320);
    setHeight(568);
    setPosition("center");
    setAutoplay(false);
    setControls(true);
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
      const controlsParam = controls ? "1" : "0";
      const iframeHeight = width * (16 / 9);
      const embedUrl = `https://www.youtube.com/embed/${previewVideoId}?autoplay=${autoplayParam}&controls=${controlsParam}&showinfo=0&rel=0&modestbranding=1`;

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
            src={embedUrl}
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
                    style={{ width: '100%', height: '100%' }}
                >
                </blockquote>
            </>
        );
    }

    if (previewPlatform === "slides") {
      let slidesSrc = previewVideoId.includes("docs.google.com")
        ? previewVideoId.replace("/edit", "/embed")
        : previewVideoId;
      return (
        <iframe
          width="100%"
          height="100%"
          src={slidesSrc}
          title="Slides presentation"
          frameBorder="0"
          allowFullScreen
        />
      );
    }

    return null;
  };

  return (
    <HelmetProvider>
      <div className="flex h-screen bg-background text-foreground">
        <aside className="w-80 shrink-0 border-r border-border p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Embed Generator</h1>
              <Link to="/embeds">
                <Button variant="outline" size="sm">View Gallery</Button>
              </Link>
            </div>

            <div className="space-y-2 mb-4">
              <Label className="text-sm font-medium">Plan: {userPlan.name}</Label>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(embedCount / userPlan.limit) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground text-right">
                {embedCount} / {userPlan.limit === Infinity ? 'Unlimited' : userPlan.limit} embeds
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="video-url">Content URL</Label>
                <Input
                  id="video-url"
                  placeholder="Enter YouTube, TikTok, or Instagram URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              {showPreview ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Dimensions</h2>
                    <div className="flex gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[width]}
                      onValueChange={(value) => {
                        const newWidth = value[0];
                        setWidth(newWidth);
                        if (isVerticalVideo) {
                          setHeight(Math.round(newWidth * (16 / 9)));
                        }
                      }}
                      max={1000}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Select
                      value={position}
                      onValueChange={setPosition}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2 rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="autoplay" className="font-normal">Autoplay</Label>
                        <Switch
                          id="autoplay"
                          checked={autoplay}
                          onCheckedChange={setAutoplay}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="controls" className="font-normal">Show Controls</Label>
                        <Switch
                          id="controls"
                          checked={controls}
                          onCheckedChange={setControls}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground pt-12">
                  <Presentation className="mx-auto h-12 w-12" />
                  <p className="mt-4">Paste a video URL to get started.</p>
                </div>
              )}
            </div>
          </div>
          
          <Button onClick={showPreview ? handleGenerate : () => generateEmbedCode(true, false)} size="lg" className="w-full" disabled={isEmbedLimitReached && !showPreview}>
            {showPreview ? (
              <>
                <Code className="mr-2 h-4 w-4" />
                {showCode ? "Update Code" : "Generate Code"}
              </>
            ) : (
              <>
                Generate Preview
                <MoveRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

        </aside>

        <main className="flex-1 flex flex-col p-8 bg-muted/20">
          <div className="flex-1 flex items-center justify-center">
            {showPreview && (
              <Rnd
                size={{ width, height }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setWidth(ref.offsetWidth);
                  setHeight(ref.offsetHeight);
                }}
                className="relative shadow-2xl rounded-lg"
                lockAspectRatio={isVerticalVideo}
              >
                {renderPreview()}
              </Rnd>
            )}
          </div>

          {showPreview && (
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-2xl">
                {showCode ? (
                    <div className="w-full p-4 bg-background rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Embed Code</Label>
                        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          <span className="ml-2">{copied ? "Copied!" : "Copy"}</span>
                        </Button>
                      </div>
                      <pre className="text-sm bg-muted p-4 rounded-md overflow-x-auto">
                        <code>{embedCode}</code>
                      </pre>
                    </div>
                ) : (
                  <div className="text-center">
                    <Button variant="ghost" onClick={resetToDefault}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      New Embed
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
        <AlertDialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
              <AlertDialogDescription>
                You've reached your embed limit for the {userPlan.name} plan. Please upgrade to the Pro plan to create more embeds.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link to="/pricing">Upgrade</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </HelmetProvider>
  );
};

export default Dashboard; 