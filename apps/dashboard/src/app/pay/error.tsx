"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
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
