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
  if (packagePath) {
    const text = await zip.file(packagePath).async("string");
    const packageJson = JSON.parse(text);
    technologies = Object.keys(packageJson.dependencies || {});
  }
  const envPath = fileNames.find(
    (path) => path.endsWith(".env.example") || path.endsWith(".env.sample"),
  );
  //  otherwise, send back the file's name and size
  return NextResponse.json({
    name: file.name,
    size: file.size,
    fileNames,
    packagePath,
    technologies,
  });
}
