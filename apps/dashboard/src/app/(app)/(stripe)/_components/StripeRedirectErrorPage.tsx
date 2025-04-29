import { AlertTriangleIcon } from "lucide-react";

export function StripeRedirectErrorPage(props: {
  errorMessage: string;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center text-center text-sm">
        <div className="mb-4 rounded-full border p-2">
          <AlertTriangleIcon className="size-5 text-destructive-text" />
        </div>
        <p className="font-medium text-base">{props.errorMessage}</p>
      </div>
    </div>
  );
}
