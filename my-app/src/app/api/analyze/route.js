import { NextResponse } from "next/server";
import JSZip from "jszip";

export async function POST(request) {
  const formData = await request.formData();

  // get the file out of formData
  const file = formData.get("file");

  //  if there is no file, send back an error
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  //upload file
  const buffer = await file.arrayBuffer();
  //let jsZip open those bytes
  const zip = await JSZip.loadAsync(buffer);
  //the list file path
  const fileNames = Object.keys(zip.files).filter((path) => {
    return (
      !path.includes("node_modules/") &&
      !path.includes(".git/") &&
      !zip.files[path].dir
    );
  });
  const packagePath = fileNames.find((path) => path.endsWith("package.json"));

  let technologies = [];
  let description = "";
  let scripts = {};
  if (packagePath) {
    const text = await zip.file(packagePath).async("string");
    const packageJson = JSON.parse(text);
    technologies = Object.keys(packageJson.dependencies || {});
    description = packageJson.description || "";
    scripts = packageJson.scripts || {};
  }
  const envPath = fileNames.find(
    (path) => path.endsWith(".env.example") || path.endsWith(".env.sample"),
  );
  let envVariables = [];
  if (envPath) {
    const envText = await zip.file(envPath).async("string");

    const lines = envText.split("\n");
    envVariables = lines
      .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"))
      .map((line) => line.split("=")[0].trim());
  }
  //  otherwise, send back the file's name and size
  return NextResponse.json({
    name: file.name,
    size: file.size,
    fileNames,
    packagePath,
    envPath,
    technologies,
    envVariables,
    description,
    scripts,
  });
}
