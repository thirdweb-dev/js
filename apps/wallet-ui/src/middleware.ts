import { type NextRequest, NextResponse } from "next/server";

export const config = { matcher: "/((?!.*\\.).*)" };

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Match pattern: something.ecosystem.domain.tld
  const match = hostname.match(/^([^.]+)\.ecosystem\.([^.]+\.[^.]+)$/);

  if (match) {
    const [_, subdomain, primaryDomain] = match;

    // Redirect to ecosystem.domain.tld/subdomain
    const newUrl = new URL(`${url.protocol}//ecosystem.${primaryDomain}`);
    newUrl.pathname = `/${subdomain}${url.pathname}`;
    newUrl.search = url.search;

    // 308 is permanent redirect, preserves request method
    return NextResponse.redirect(newUrl, 308);
  }

  return NextResponse.next();
}
