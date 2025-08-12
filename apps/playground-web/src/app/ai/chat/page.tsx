import { createThirdwebClient } from "thirdweb";
import { ChatPageContent } from "../components/ChatPageContent";

// Mock client for playground - you'll need to configure this with your actual client ID
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here",
});

export default function ChatPage() {
  // Mock auth data - in a real app, you'd get this from your auth system
  const mockAuthToken = "mock-auth-token";
  const mockAccountAddress = "0x1234567890123456789012345678901234567890";

  return (
    <div className="min-h-screen">
      <ChatPageContent
        accountAddress={mockAccountAddress}
        authToken={mockAuthToken}
        client={client}
        initialParams={undefined}
        session={undefined}
        type="new-chat"
      />
    </div>
  );
}

export const metadata = {
  title: "AI Chat - Playground",
  description: "Chat with Nebula AI for blockchain interactions",
};