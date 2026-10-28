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
    <div className="min-h-screen px-4 py-8 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-widest text-gray-400">
            LOTI README CHATBOT
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 transition hover:text-white"
          >
            Log out
          </button>
        </div>

        {/* PIECE 1: heading and upload area */}
        <div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Drop your project
          </h1>
          <p className="mt-3 text-gray-400">
            Upload a .zip and get a README back.
          </p>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/20 bg-white/5 p-10 text-center transition hover:border-white/40"
          >
            <p className="text-gray-300">
              Drag your .zip here, or choose a file
            </p>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-5 file:py-2 file:font-medium file:text-black hover:file:bg-gray-200"
            />
            {file && (
              <p className="text-sm text-gray-400">Selected: {file.name}</p>
            )}
            {file && (
              <button
                onClick={handleUpload}
                className="rounded-full bg-white px-7 py-2.5 font-medium text-black transition hover:bg-gray-200"
              >
                Analyze
              </button>
            )}
          </div>
        </div>

        {/* PIECE 2: analysis result (plain for now) */}
        {result && (
          <div className="flex flex-col gap-4">
            <p className="text-lg font-semibold">{result.name}</p>

            {result.technologies && result.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded bg-white/10 px-2 py-1 text-xs text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {result.envVariables && result.envVariables.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.envVariables.map((envVar) => (
                  <span
                    key={envVar}
                    className="rounded border border-white/15 px-2 py-1 font-mono text-xs text-gray-300"
                  >
                    {envVar}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="self-start rounded-full bg-white px-7 py-2.5 font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate README"}
            </button>
          </div>
        )}

        {/* PIECE 3: README preview (plain for now) */}
        {readme && (
          <div>
            <div className="mb-3 flex gap-4 text-sm">
              <button
                onClick={handleCopy}
                className="text-gray-400 transition hover:text-white"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                className="text-gray-400 transition hover:text-white"
              >
                {downloaded ? "Downloaded!" : "Download"}
              </button>
            </div>
            <div className="prose prose-invert max-w-none rounded-xl border border-white/10 bg-black/50 p-6">
              <ReactMarkdown>{readme}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* testing only: remove before deploying */}
        <button
          onClick={() => setReadme(sampleReadme)}
          className="self-start text-xs text-gray-600 hover:text-gray-400"
        >
          Load sample
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
