import { createThirdwebAI } from "@thirdweb-dev/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
  const SECRET_KEY = process.env.THIRDWEB_SECRET_KEY as string;

  const thirdwebAI = createThirdwebAI({
    baseURL: `https://${process.env.NEXT_PUBLIC_API_URL}`,
    secretKey: SECRET_KEY,
  });

  const body = await req.json();
  const { messages, id }: { messages: UIMessage[]; id: string } = body;

  const result = streamText({
    model: thirdwebAI.chat(id),
    messages: convertToModelMessages(messages),
    tools: thirdwebAI.tools(),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
