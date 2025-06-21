import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Copy, Check, Settings, Eye, Presentation, Code } from "lucide-react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch";


const Dashboard = () => {
  const [urlsText, setUrlsText] = useState("");
  const [width, setWidth] = useState([700]);
  const [height, setHeight] = useState([400]);
  const [position, setPosition] = useState("center");
  const [autoplay, setAutoplay] = useState(false);
  const [controls, setControls] = useState(true);
  const [borderRadius, setBorderRadius] = useState([8]);
  const [bgColor, setBgColor] = useState("#f0f0f0");
  const [orientation, setOrientation] = useState("horizontal");
  const [previewEmbeds, setPreviewEmbeds] = useState<{platform: string; id: string}[]>([]);
  const [embedCode, setEmbedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [embedCount, setEmbedCount] = useState(3);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState("");
  const [previewVideoId, setPreviewVideoId] = useState("");

  const generateEmbedCode = () => {
    const urls = urlsText.split(/\n+/).map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) return;

    const embeds = urls.map((url) => {
      let platform = "";
      let videoId = "";
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        platform = "youtube";
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        videoId = match && match[8].length === 11 ? match[8] : "";
      } else if (url.includes("tiktok.com")) {
        platform = "tiktok";
        const regExp = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
        const match = url.match(regExp);
        videoId = match ? match[1] : "";
      } else if (url.includes("instagram.com")) {
        platform = "instagram";
        const regExp = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/;
        const match = url.match(regExp);
        videoId = match ? match[1] : "";
      } else if (url.includes("slideshare.net") || url.includes("slides.com") || url.includes("docs.google.com/presentation")) {
        platform = "slides";
        videoId = url;
      }
      return { platform, videoId };
    }).filter((e) => e.videoId);

    if (embeds.length === 0) {
      alert("Please enter a valid YouTube (including Shorts), TikTok, Instagram Reels, or Slides URL");
      return;
    }

    setPreviewEmbeds(embeds);
    setPreviewPlatform(embeds[0].platform);
    setPreviewVideoId(embeds[0].videoId);

    let embedHtml = "";

    if (embeds.length === 1 && embeds[0].platform === "youtube") {
      const videoId = embeds[0].videoId;
      const autoplayParam = autoplay ? "1" : "0";
      const controlsParam = controls ? "1" : "0";
      embedHtml = `<div style="display: flex; justify-content: ${position}; width: 100%; background-color: ${bgColor}; border-radius: ${borderRadius[0]}px; overflow:hidden;">`
        + `\n  <iframe\n    width="${width[0]}"\n    height="${height[0]}"\n    src="https://www.youtube.com/embed/${videoId}?autoplay=${autoplayParam}&controls=${controlsParam}"\n    title="YouTube video player"\n    frameborder="0"\n    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\n    allowfullscreen></iframe>\n</div>`;
    } else if (embeds.length === 1 && embeds[0].platform === "tiktok") {
      const videoId = embeds[0].videoId;
      embedHtml = `<div style="display: flex; justify-content: ${position}; width: 100%; background-color: ${bgColor}; border-radius: ${borderRadius[0]}px; overflow:hidden;">\n  <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@user/video/${videoId}" data-video-id="${videoId}" style="max-width: ${width[0]}px; min-width: 325px;"></blockquote>\n  <script async src="https://www.tiktok.com/embed.js"></script>\n</div>`;
    } else if (embeds.length === 1 && embeds[0].platform === "instagram") {
      const videoId = embeds[0].videoId;
      embedHtml = `<div style="display: flex; justify-content: ${position}; width: 100%; background-color: ${bgColor}; border-radius: ${borderRadius[0]}px; overflow:hidden;">\n  <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/${videoId}/" style="width: ${width[0]}px; max-width: ${width[0]}px;"></blockquote>\n  <script async src="//www.instagram.com/embed.js"></script>\n</div>`;
    } else if (embeds.length === 1 && embeds[0].platform === "slides") {
      let slidesSrc = embeds[0].videoId;
      if (slidesSrc.includes("docs.google.com")) {
        slidesSrc = slidesSrc.replace("/edit", "/embed");
      }
      embedHtml = `<div style="display: flex; justify-content: ${position}; width: 100%; background-color: ${bgColor}; border-radius: ${borderRadius[0]}px; overflow:hidden;">\n  <iframe width="${width[0]}" height="${height[0]}" src="${slidesSrc}" title="Slides presentation" frameborder="0" allowfullscreen></iframe>\n</div>`;
    } else {
      const slides = embeds.map((e) => {
        if (e.platform === "youtube") {
          const autoplayParam = autoplay ? "1" : "0";
          const controlsParam = controls ? "1" : "0";
          return `<div class="embla__slide"><iframe width="${width[0]}" height="${height[0]}" src="https://www.youtube.com/embed/${e.videoId}?autoplay=${autoplayParam}&controls=${controlsParam}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        } else if (e.platform === "tiktok") {
          return `<div class="embla__slide"><blockquote class="tiktok-embed" cite="https://www.tiktok.com/@user/video/${e.videoId}" data-video-id="${e.videoId}" style="max-width: ${width[0]}px; min-width: 325px;"></blockquote></div>`;
        } else if (e.platform === "instagram") {
          return `<div class="embla__slide"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/reel/${e.videoId}/" style="width: ${width[0]}px; max-width: ${width[0]}px;"></blockquote></div>`;
        }
        let slidesSrc = e.videoId;
        if (slidesSrc.includes("docs.google.com")) {
          slidesSrc = slidesSrc.replace("/edit", "/embed");
        }
        return `<div class="embla__slide"><iframe width="${width[0]}" height="${height[0]}" src="${slidesSrc}" frameborder="0" allowfullscreen></iframe></div>`;
      }).join("\n");
      embedHtml = `<div class="embla" style="width:${width[0]}px;margin:auto;background-color:${bgColor};border-radius:${borderRadius[0]}px;overflow:hidden;">\n  <div class="embla__container" style="display:flex">\n    ${slides}\n  </div>\n</div>\n<script src="https://cdn.jsdelivr.net/npm/embla-carousel/embla-carousel.umd.js"></script>\n<script>EmblaCarousel(document.querySelector('.embla'),{ loop:true, axis:'${orientation==='vertical'?'y':'x'}' });</script>`;
    }

    setEmbedCode(embedHtml);
    setEmbedCount((prev) => prev + 1);
    setShowPreview(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderPreview = () => {
    if (!showPreview || previewEmbeds.length === 0) return null;

    const justifyContent = position === "flex-start" ? "flex-start" : position === "flex-end" ? "flex-end" : "center";

    const renderSingle = (platform: string, id: string) => {
      if (platform === "youtube") {
        const autoplayParam = autoplay ? "1" : "0";
        const controlsParam = controls ? "1" : "0";
        return (
          <iframe
            width={width[0]}
            height={height[0]}
            src={`https://www.youtube.com/embed/${id}?autoplay=${autoplayParam}&controls=${controlsParam}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      } else if (platform === "slides") {
        let slidesSrc = id;
        if (id.includes("docs.google.com")) {
          slidesSrc = id.replace("/edit", "/embed");
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
            borderRadius: "8px"
          }}
        >
          <span className="text-muted-foreground">
            {platform === "tiktok" ? "TikTok Preview" : "Instagram Preview"}
          </span>
        </div>
      );
    };

    if (previewEmbeds.length > 1) {
      return (
        <Carousel className="w-full" opts={{ loop: true, axis: orientation === 'vertical' ? 'y' : 'x' }}>
          <CarouselContent>
            {previewEmbeds.map((e, idx) => (
              <CarouselItem key={idx}>{renderSingle(e.platform, e.id)}</CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      );
    }

    const { platform, id } = previewEmbeds[0];
    return <div style={{ display: "flex", justifyContent, width: "100%" }}>{renderSingle(platform, id)}</div>;
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
            <Textarea
              id="content-url"
              placeholder="Enter one URL per line"
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              className="bg-gray-800 border-gray-700 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">Supports: YouTube, TikTok, Instagram Reels, Google Slides, SlideShare. Multiple URLs will create a carousel.</p>
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
                <Slider id="height" min={150} max={800} step={10} value={height} onValueChange={setHeight} />
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
            <Label htmlFor="orientation" className="text-base font-medium text-gray-300">Carousel Orientation</Label>
            <Select value={orientation} onValueChange={setOrientation}>
              <SelectTrigger className="w-full mt-2 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="vertical">Vertical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="mb-4 text-base font-medium text-gray-300">Style</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <Label htmlFor="radius">Border Radius</Label>
                  <span className="text-sm text-gray-400">{borderRadius[0]}px</span>
                </div>
                <Slider id="radius" min={0} max={30} step={1} value={borderRadius} onValueChange={setBorderRadius} />
              </div>
              <div>
                <Label htmlFor="bgColor" className="block mb-1">Background</Label>
                <input
                  id="bgColor"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-full h-8 p-0 border-none bg-transparent"
                />
              </div>
            </div>
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
                  <pre className="bg-gray-900 p-4 rounded-md text-sm overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
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