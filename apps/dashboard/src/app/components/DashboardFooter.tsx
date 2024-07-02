import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="flex flex-col items-center justify-center gap-4 p-4 border-t md:flex-row bg-card">
      <a
        target="_blank"
        href="https://feedback.thirdweb.com"
        rel="noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        Feedback
      </a>
      <Link
        href="/privacy"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        Privacy Policy
      </Link>
      <Link
        href="/tos"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        Terms of Service
      </Link>
      <Link
        href="/gas"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        Gas Estimator
      </Link>
      <Link
        href="/chainlist"
        target="_blank"
        rel="noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        Chain List
      </Link>
      <p className="text-sm text-muted-foreground">Copyright © 2024 thirdweb</p>
    </footer>
  );
}
