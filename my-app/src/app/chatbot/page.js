"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
  // 1. HOOKS (always first)
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [readme, setReadme] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // 2. SESSION CHECK
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
    };
    checkUser();
  }, [router]);

  // 3. FUNCTIONS
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //add drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".zip")) {
      setFile(droppedFile);
    }
  }; // handleDrop closes here

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    //console.log(data);
    setResult(data);
  };
  const handleGenerate = async () => {
    if (!result) return;
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: result.name,
        technologies: result.technologies,
        envVariables: result.envVariables,
        description: result.description,
        scripts: result.scripts,
      }),
    });
    const data = await response.json();
    if (data.error) {
      setReadme("Error:" + data.error);
    } else {
      setReadme(data.readme);
    }
    setLoading(false);
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(readme);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const handleDownload = () => {
    const blob = new Blob([readme], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "README.md";
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };
  const sampleReadme = `# My Project
  A short description of the project.

  ## Tech Stack
  - React
  - Next.js
  - Supabase

  ## Installation
  1. Clone the repo
  2. Run npm install
  3. Run npm run dev
  `;

  // 4. WHAT THE PAGE SHOWS
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">README Chatbot</h1>
          <button
            onClick={handleLogout}
            className="border border-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition"
          >
            Log out
          </button>
        </div>

        {/* upload card */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="bg-white/10 backdrop-blur-md border-2 border-dashed border-white/30 rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
        >
          <p className="text-gray-300">
            Drag your project .zip here, or choose a file
          </p>
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            className="text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-white hover:file:bg-blue-600"
          />
          {file && (
            <p className="text-sm text-gray-400">Selected: {file.name}</p>
          )}
          {file && (
            <button
              onClick={handleUpload}
              className="bg-blue-500 hover:bg-blue-600 transition px-6 py-2 rounded-lg font-semibold"
            >
              Analyze
            </button>
          )}
        </div>

        {/* analysis card */}
        {result && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-lg font-semibold">{result.name}</p>
              <p className="text-sm text-gray-400">{result.size} bytes</p>
            </div>

            {result.technologies && result.technologies.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-300 mb-2">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-500/20 border border-blue-500/40 text-blue-200 text-xs px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.envVariables && result.envVariables.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-300 mb-2">
                  Environment Variables
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.envVariables.map((envVar) => (
                    <span
                      key={envVar}
                      className="bg-white/10 border border-white/20 text-gray-200 text-xs px-3 py-1 rounded-full font-mono"
                    >
                      {envVar}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 transition py-3 rounded-lg font-semibold"
            >
              {loading ? "Generating..." : "Generate README"}
            </button>
          </div>
        )}

        {/* README card */}
        {readme && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleCopy}
                className="border border-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition"
              >
                {copied ? "Copied!" : "Copy README"}
              </button>
              <button
                onClick={handleDownload}
                className="border border-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition"
              >
                {downloaded ? "Downloaded!" : "Download README.md"}
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{readme}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* testing only: remove before deploying */}
        <button
          onClick={() => setReadme(sampleReadme)}
          className="text-xs text-gray-500 hover:text-gray-300 self-start"
        >
          Load sample
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
