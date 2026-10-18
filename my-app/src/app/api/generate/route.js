import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request) {
  //read the json the page sends us
  const { name, technologies = [], envVariables = [] } = await request.json();

  //a string telling the Ai what to write
  const prompt = `Write a GitHub README in Markdown for a project called ${name}.
                    Start with a short description of what the project does and a friendly introduction.
                    add badges for the technologies used in the project.
                    It uses these technologies: ${technologies.join(", ")}.
                    It needs these environment variables: ${envVariables.join(", ")}.
                    Include sections for: Tech Stack, Installation, Environment Variables, Running the Project, Contributing.`;

  //ask OpenAI
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
  //send the Readme text back
  const readme = completion.choices[0].message.content;
  return NextResponse.json({ readme });
}
