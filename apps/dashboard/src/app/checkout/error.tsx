"use client"; // Error boundaries must be Client Components

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Card className="overflow-hidden text-center">
      <CardHeader className="border-b md:border-b-0">
        <CardTitle className="font-bold text-destructive text-lg">
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground">
        {error.message}
      </CardContent>
    </Card>
  );
}
