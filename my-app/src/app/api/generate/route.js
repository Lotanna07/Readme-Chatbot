import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    });

    const {
      name,
      technologies = [],
      envVariables = [],
      description = "",
      scripts = {},
    } = await request.json();

    const prompt = `Write a GitHub README in Markdown for a project called ${name.replace(".zip", "")}.
Start with a short description of what the project does and a friendly introduction.
Add badges for the technologies used in the project.
It uses these technologies: ${technologies.join(", ")}.
It needs these environment variables: ${envVariables.join(", ")}.
Project description (may be empty): ${description}.
Available npm scripts: ${JSON.stringify(scripts)}.
In the Running the project section, use only the npm 
script listed above. Do not invent any commands
Include these sections, each as a ## heading with exactly this name: Tech Stack, Installation, Environment Variables, Running the Project, Contributing.`;

    const completion = await openai.chat.completions.create({
      model: "gemini-3.8-flash",
      messages: [{ role: "user", content: prompt }],
    });

    const readme = completion.choices[0].message.content;
    return NextResponse.json({ readme });
  } catch (error) {
    console.log("GENERATE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
