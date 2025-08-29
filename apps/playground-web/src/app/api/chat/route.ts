import { createThirdwebAI } from "@thirdweb-dev/ai-sdk-provider";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Allow streaming responses up to 5 minutes
export const maxDuration = 300;

const thirdwebAI = createThirdwebAI({
  baseURL: `https://${process.env.NEXT_PUBLIC_API_URL}`,
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, sessionId }: { messages: UIMessage[]; sessionId: string } =
    body;

  const result = streamText({
    model: thirdwebAI.chat({
      context: {
        session_id: sessionId,
      },
    }),
    messages: convertToModelMessages(messages),
    tools: thirdwebAI.tools(),
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    messageMetadata({ part }) {
      if (part.type === "finish-step") {
        return {
          session_id: part.response.id,
        };
      }
    },
  });
}
