import { useEffect, useState } from "react";
import { ArrowLeft, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SavedEmbed {
  url: string;
  code: string;
  date: string;
}

const PastEmbeds = () => {
  const [embeds, setEmbeds] = useState<SavedEmbed[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("embeds");
    if (stored) {
      try {
        setEmbeds(JSON.parse(stored));
      } catch {
        setEmbeds([]);
      }
    }
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </a>
          <div className="w-px h-6 bg-gray-800" />
          <h1 className="text-xl font-semibold">Past Embeds</h1>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/dashboard">Back to Generator</a>
        </Button>
      </header>
      <main className="p-6">
        {embeds.length === 0 ? (
          <p className="text-center text-gray-400">No embeds yet.</p>
        ) : (
          <Table className="bg-gray-800/50 rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {embeds.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{new Date(e.date).toLocaleString()}</TableCell>
                  <TableCell className="break-all">{e.url}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => copyCode(e.code)}>
                      <Copy className="w-4 h-4 mr-2" />Copy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  );
};

export default PastEmbeds;
