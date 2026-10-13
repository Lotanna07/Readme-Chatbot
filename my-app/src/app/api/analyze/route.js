import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();

  // get the file out of formData
  const file = formData.get("file");

  //  if there is no file, send back an error
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  //  otherwise, send back the file's name and size
  return NextResponse.json({ name: file.name, size: file.size });
}
