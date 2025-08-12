import ThirdwebProvider from "../../../components/thirdweb-provider";
import { THIRDWEB_CLIENT } from "../../../lib/client";
import { ChatPageContent } from "../components/ChatPageContent";

export default function ChatPage() {
  // Mock auth data - in a real app, you'd get this from your auth system
  const mockAuthToken = "mock-auth-token";
  const mockAccountAddress = "0x1234567890123456789012345678901234567890";

  return (
    <div className="min-h-screen">
      <ThirdwebProvider>
        <ChatPageContent
          accountAddress={mockAccountAddress}
          authToken={mockAuthToken}
          client={THIRDWEB_CLIENT}
          initialParams={undefined}
          session={undefined}
          type="new-chat"
        />
      </ThirdwebProvider>
    </div>
  );
}

export const metadata = {
  title: "AI Chat API - Playground",
  description: "Chat with thirdweb AI for blockchain interactions",
};
