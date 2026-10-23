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
    <div>
      <h1>Chatbot</h1>
      <p>Drop project here</p>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 my-4"
      >
        <p>Drag your project .zip here, or choose a file</p>
        <input type="file" accept=".zip" onChange={handleFileChange} />
      </div>
      {file && <p>Selected: {file.name}</p>}
      {file && <button onClick={handleUpload}>Analyze</button>}
      {result && (
        <p>
          {result.name} ({result.size} bytes)
        </p>
      )}

      {result && result.technologies && (
        <div>
          <h2>Technologies:</h2>
          <ul>
            {result.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
      )}
      {result && result.envVariables && (
        <div>
          <h2>Environment Variables:</h2>
          <ul>
            {result.envVariables.map((envVar) => (
              <li key={envVar}>{envVar}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={() => setReadme(sampleReadme)}>Load sample</button>
      {result && (
        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      )}
      {readme && (
        <button onClick={handleCopy}>{copied ? "copied!" : "Copy"}</button>
      )}
      {readme && (
        <div className="prose">
          <ReactMarkdown>{readme}</ReactMarkdown>
        </div>
      )}
      {readme && (
        <button onClick={handleDownload}>
          {downloaded ? "Downloaded" : "Download README.md"}
        </button>
      )}
      <button onClick={handleLogout}>Log out</button>
    </div>
  );
};

export default Chatbot;
