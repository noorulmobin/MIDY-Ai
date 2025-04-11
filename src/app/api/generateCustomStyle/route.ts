import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, apiKey, model } = await req.json();
  const fetchUrl = process.env.NEXT_PUBLIC_API_URL + "/v1";
  const openai = new OpenAI({ apiKey, baseURL: fetchUrl });

  const subPrompt = getPrompt(prompt);
  try {
    const response = await openai.chat.completions.create({
      model,
      stream: false,
      messages: [{ role: "user", content: subPrompt }],
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      n: 1,
    });
    if (response?.choices[0]?.message?.content) {
      const newPrompt = response?.choices[0]?.message?.content;
      return NextResponse.json({ data: newPrompt }, { status: 200 });
    }
    return NextResponse.json({ error: "Generation failed" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(error.error, { status: error.status });
  }
}

const getPrompt = (content: string) => {
  return `Optimize and enhance the prompt which provided for image generation, make sure that can be generate an excellent view by Midjourney or other Diffusion models.

        You should describe the view of the prompt in detailed and accurately, and you should add some parts if the provided prompt is too simple. You can use some famous IP names if needed.

        Use higher weight to introduce the subject. Do not use any introductory phrase like 'This image shows', 'In the scene' or other similar phrases. Don't use words that describe cultural values ​​or spirituality like 'create a xxx atmosphere', 'creating xxx presence', 'hinting at xxx', 'enhancing the xxxx of the scene' or others. Don't use ambiguous words. Just describe the scene which you see. Don't over-describe the indescribable.

        You can describe the scene fluently using natural language like a native speaker. Use 'TOK' to replace the subject of the content, such as 'a female', 'a man', don't use gender-specific pronouns.

        Input content:<text>
        ${content}
        </text>

        Always return the result in English in plain text format, do not add any other contents.`;
};
