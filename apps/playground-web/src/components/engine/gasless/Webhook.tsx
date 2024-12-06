import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

// This says Webhook, but it's actually just displaying a dummy webhook

interface WebhookData {
  queueId?: string;
  status?: string;
}

export function Webhook({ queueId }: { queueId: string }) {
  const [data, setData] = useState<WebhookData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!queueId) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/claimTo?queueId=${queueId}`);
        const jsonData = await response.json();
        setData(jsonData);

        // Continue polling if not in a final state
        if (jsonData.status !== "Mined" && jsonData.status !== "error") {
          setTimeout(fetchData, 1500); // Match the backend polling interval
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    setLoading(true);
    fetchData();

    // Cleanup polling on unmount or queueId change
    return () => {
      setData(null);
      setLoading(false);
    };
  }, [queueId]);

  return (
    <Card className="mt-8 w-full bg-background">
      <CardHeader>
        <CardTitle>Webhook Response</CardTitle>
        <CardDescription>{data?.status || "Initializing..."}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[100px] w-full">
          {loading && !data ? (
            <p>Loading...</p>
          ) : (
            <pre>
              <code>
                {JSON.stringify(
                  {
                    queueId: data?.queueId,
                    status: data?.status,
                  },
                  null,
                  2,
                )}
              </code>
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
