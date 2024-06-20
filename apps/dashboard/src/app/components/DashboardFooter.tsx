import Link from "next/link";

export function DashboardFooter() {
  return (
    <footer className="border-t py-4 justify-center items-center flex-col md:flex-row flex gap-4 bg-card">
      <a
        target="_blank"
        href="https://feedback.thirdweb.com"
        rel="noreferrer"
        className="text-muted-foreground text-sm hover:underline"
      >
        Feedback
      </a>
      <Link
        href="/privacy"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground text-sm hover:underline"
      >
        Privacy Policy
      </Link>
      <Link
        href="/tos"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground text-sm hover:underline"
      >
        Terms of Service
      </Link>
      <Link
        href="/gas"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground text-sm hover:underline"
      >
        Gas Estimator
      </Link>
      <Link
        href="/chainlist"
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground text-sm hover:underline"
      >
        Chain List
      </Link>
      <p className="text-muted-foreground text-sm">Copyright © 2024 thirdweb</p>
    </footer>
  );
}
