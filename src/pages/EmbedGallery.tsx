import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Check, Plus, Trash2 } from "lucide-react";

interface Embed {
  url: string;
  code: string;
  date: string;
}

const EmbedGallery = () => {
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedEmbeds = JSON.parse(localStorage.getItem("embeds") || "[]");
      setEmbeds(storedEmbeds);
    } catch {
      setEmbeds([]);
    }
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const deleteEmbed = (index: number) => {
    const updatedEmbeds = [...embeds];
    updatedEmbeds.splice(index, 1);
    setEmbeds(updatedEmbeds);
    localStorage.setItem("embeds", JSON.stringify(updatedEmbeds));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Embed Gallery</h1>
          <Button asChild>
            <Link to="/"><Plus className="mr-2 h-4 w-4" /> Create New Embed</Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-8">
        {embeds.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {embeds.map((embed, index) => (
              <div key={index} className="bg-muted/30 rounded-lg border p-4 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground truncate mb-2" title={embed.url}>{embed.url}</p>
                  <div className="aspect-video bg-background rounded-md mb-4 flex items-center justify-center">
                    <div dangerouslySetInnerHTML={{ __html: embed.code }} className="transform scale-50" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>{new Date(embed.date).toLocaleDateString()}</p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(embed.code)}>
                            {copiedCode === embed.code ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteEmbed(index)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold">No Embeds Yet</h2>
            <p className="text-muted-foreground mt-2">Create your first embed to see it here.</p>
            <Button asChild className="mt-6">
                <Link to="/">Create New Embed</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmbedGallery; 