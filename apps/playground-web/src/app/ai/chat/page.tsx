import ThirdwebProvider from "../../../components/thirdweb-provider";
import { THIRDWEB_CLIENT } from "../../../lib/client";
import { ChatPageContent } from "../components/ChatPageContent";

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      <ThirdwebProvider>
        <ChatPageContent client={THIRDWEB_CLIENT} type="new-chat" />
      </ThirdwebProvider>
    </div>
  );
}

export const metadata = {
  title: "AI Chat API - Playground",
  description: "Chat with thirdweb AI for blockchain interactions",
};
