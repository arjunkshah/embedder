import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Check, Settings, Eye, Presentation, Code } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";
import { Rnd } from "react-rnd";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";


const Dashboard = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [width, setWidth] = useState([360]);
  const [height, setHeight] = useState([640]);
  const [position, setPosition] = useState("center");
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [snippets, setSnippets] = useState({
    html: "",
    react: "",
    markdown: "",
  });
  const [language, setLanguage] = useState("html");
  const [copied, setCopied] = useState(false);
  const [embedCount, setEmbedCount] = useState(3);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState("");
  const [previewVideoId, setPreviewVideoId] = useState("");

  const updateEmbed = (id: string, platform: string) => {
    let html = "";
    const autoplayParam = autoplay ? "1" : "0";
    const controlsParam = controls ? "1" : "0";
    const justify = position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center";

    if (platform === "youtube") {
      html = `<div style="display:flex;justify-content:${justify};width:100%;">
  <iframe
    width="${width[0]}"
    height="${height[0]}"
    src="https://www.youtube.com/embed/${id}?autoplay=${autoplayParam}&controls=${controlsParam}&modestbranding=1&rel=0&playsinline=1&fs=0"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>`;
    } else if (platform === "tiktok") {
      html = `<div style="display:flex;justify-content:${justify};width:100%;">
  <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@user/video/${id}" data-video-id="${id}" style="max-width: ${width[0]}px; min-width: 325px;">
    <section><a target="_blank" href="https://www.tiktok.com/@user/video/${id}">TikTok Video</a></section>
  </blockquote>
  <script async src="https://www.tiktok.com/embed.js"></script>
</div>`;
    } else if (platform === "instagram") {
      html = `<div style="display:flex;justify-content:${justify};width:100%;">
  <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/${id}/" style="width: ${width[0]}px; max-width: ${width[0]}px;"></blockquote>
  <script async src="//www.instagram.com/embed.js"></script>
</div>`;
    } else if (platform === "slides") {
      let slidesSrc = id;
      if (id.includes("docs.google.com")) slidesSrc = id.replace("/edit", "/embed");
      html = `<div style="display:flex;justify-content:${justify};width:100%;">
  <iframe width="${width[0]}" height="${height[0]}" src="${slidesSrc}" title="Slides presentation" frameborder="0" allowfullscreen></iframe>
</div>`;
    }
    const reactSnippet = `<div dangerouslySetInnerHTML={{ __html: \`${html.replace(/`/g, "\\`")}\` }} />`;
    const markdownSnippet = `\u0060\u0060\u0060html\n${html}\n\u0060\u0060\u0060`;
    setSnippets({ html, react: reactSnippet, markdown: markdownSnippet });
    return html;
  };

  useEffect(() => {
    if (!showPreview) return;
    if (!previewVideoId) return;
    updateEmbed(previewVideoId, previewPlatform);
  }, [width, height, position, autoplay, controls, previewVideoId, previewPlatform, showPreview]);

  const generateEmbedCode = () => {
    if (!videoUrl) return;

    let videoId = "";
    let platform = "";
    
    // Enhanced URL detection
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      platform = "youtube";
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/;
      const match = videoUrl.match(regExp);
      videoId = match && match[8].length === 11 ? match[8] : "";
    }
    else if (videoUrl.includes("tiktok.com")) {
      platform = "tiktok";
      const regExp = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
      const match = videoUrl.match(regExp);
      videoId = match ? match[1] : "";
    }
    else if (videoUrl.includes("instagram.com")) {
      platform = "instagram";
      const regExp = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
      const match = videoUrl.match(regExp);
      videoId = match ? match[1] : "";
    }
    else if (videoUrl.includes("slideshare.net") || videoUrl.includes("slides.com") || videoUrl.includes("docs.google.com/presentation")) {
      platform = "slides";
      videoId = videoUrl;
    }

    if (!videoId) {
      alert("Please enter a valid YouTube (including Shorts), TikTok, Instagram Reels, or Slides URL");
      return;
    }

    setPreviewPlatform(platform);
    setPreviewVideoId(videoId);

    const embedHtml = updateEmbed(videoId, platform);
    setEmbedCount(prev => prev + 1);
    setShowPreview(true);

    try {
      const stored = JSON.parse(localStorage.getItem("embeds") || "[]");
      stored.unshift({ url: videoUrl, code: embedHtml, date: new Date().toISOString() });
      localStorage.setItem("embeds", JSON.stringify(stored.slice(0, 50)));
    } catch {
      localStorage.setItem(
        "embeds",
        JSON.stringify([{ url: videoUrl, code: embedHtml, date: new Date().toISOString() }])
      );
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippets[language as keyof typeof snippets]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPreview = () => {
    if (!showPreview || !previewVideoId) return null;

    const justifyContent = position === "left" ? "flex-start" : position === "right" ? "flex-end" : "center";

    const content = () => {
      if (previewPlatform === "youtube") {
        const autoplayParam = autoplay ? "1" : "0";
        const controlsParam = controls ? "1" : "0";
        return (
          <iframe
            width={width[0]}
            height={height[0]}
            src={`https://www.youtube.com/embed/${previewVideoId}?autoplay=${autoplayParam}&controls=${controlsParam}&modestbranding=1&rel=0&playsinline=1&fs=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      if (previewPlatform === "slides") {
        let slidesSrc = previewVideoId;
        if (previewVideoId.includes("docs.google.com")) {
          slidesSrc = previewVideoId.replace("/edit", "/embed");
        }
        return (
          <iframe
            width={width[0]}
            height={height[0]}
            src={slidesSrc}
            title="Slides presentation"
            frameBorder="0"
            allowFullScreen
          />
        );
      }

      return (
        <div
          style={{
            width: `${width[0]}px`,
            height: `${height[0]}px`,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <span className="text-muted-foreground">
            {previewPlatform === "tiktok" ? "TikTok Preview" : "Instagram Preview"}
          </span>
        </div>
      );
    };

    return (
      <div style={{ display: "flex", justifyContent, width: "100%" }}>
        <Rnd
          size={{ width: width[0], height: height[0] }}
          onDragStop={(_, d) => {
            // position is handled via flex, so just ignore drag values
          }}
          onResizeStop={(_, __, ref) => {
            setWidth([parseInt(ref.style.width, 10)]);
            setHeight([parseInt(ref.style.height, 10)]);
          }}
          bounds="parent"
        >
          {content()}
        </Rnd>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
        <a href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          Home
        </a>
        <div className="w-px h-6 bg-gray-800" />
        <h1 className="text-xl font-semibold">EmbedGen</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            {embedCount}/10 embeds used
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/embeds">Past Embeds</a>
          </Button>
          <Button variant="default" size="sm">Upgrade Pro</Button>
        </div>
      </header>
      
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-1/4 p-6 border-r border-gray-800 space-y-8">
          <div>
            <Label htmlFor="content-url" className="flex items-center gap-2 mb-2 text-base font-medium text-gray-300">
              <Settings className="w-5 h-5" />
              Content URL
            </Label>
            <Input
              id="content-url"
              type="url"
              placeholder="Paste YouTube, TikTok, Instagram"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="bg-gray-800 border-gray-700 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">Supports: YouTube, TikTok, Instagram Reels, Google Slides, SlideShare</p>
          </div>

          <div>
            <h3 className="mb-4 text-base font-medium text-gray-300">Dimensions</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="width">Width</Label>
                  <span className="text-sm text-gray-400">{width[0]}px</span>
                </div>
                <Slider id="width" min={200} max={1200} step={10} value={width} onValueChange={setWidth} />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="height">Height</Label>
                  <span className="text-sm text-gray-400">{height[0]}px</span>
                </div>
                <Slider id="height" min={200} max={1000} step={10} value={height} onValueChange={setHeight} />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="position" className="text-base font-medium text-gray-300">Position</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="mb-4 text-base font-medium text-gray-300">Options</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Switch id="autoplay" checked={autoplay} onCheckedChange={setAutoplay} />
                <Label htmlFor="autoplay" className="font-normal">Autoplay (YouTube/Slides only)</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="controls" checked={controls} onCheckedChange={setControls} />
                <Label htmlFor="controls" className="font-normal">Show controls</Label>
              </div>
            </div>
          </div>
          
          <Button onClick={generateEmbedCode} className="w-full bg-blue-600 hover:bg-blue-700">Generate Embed</Button>

        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6">
          <div className="bg-gray-800/50 rounded-lg h-full flex flex-col items-center justify-center">
            {showPreview ? (
              <div className="w-full h-full flex flex-col">
                <div className="flex-grow flex items-center justify-center">
                  {renderPreview()}
                </div>
                <div className="p-4 border-t border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Code className="w-5 h-5"/>Embed Code</h3>
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                      {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                      {copied ? 'Copied!' : 'Copy Code'}
                    </Button>
                  </div>
                  <Tabs value={language} onValueChange={setLanguage} className="w-full">
                    <TabsList>
                      <TabsTrigger value="html">HTML</TabsTrigger>
                      <TabsTrigger value="react">React</TabsTrigger>
                      <TabsTrigger value="markdown">Markdown</TabsTrigger>
                    </TabsList>
                    <TabsContent value="html">
                      <pre className="bg-gray-900 p-4 rounded-md text-sm overflow-x-auto">
                        <code>{snippets.html}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="react">
                      <pre className="bg-gray-900 p-4 rounded-md text-sm overflow-x-auto">
                        <code>{snippets.react}</code>
                      </pre>
                    </TabsContent>
                    <TabsContent value="markdown">
                      <pre className="bg-gray-900 p-4 rounded-md text-sm overflow-x-auto">
                        <code>{snippets.markdown}</code>
                      </pre>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Presentation className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Ready to Generate</h2>
                <p className="text-gray-400 mt-2">Paste a URL and click generate to see your embed preview</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 