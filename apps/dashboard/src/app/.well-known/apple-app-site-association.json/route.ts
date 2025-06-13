import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    applinks: {
      apps: ["XYHGSFAMHX.com.thirdweb.demo"],
      details: [
        {
          appIDs: ["XYHGSFAMHX.com.thirdweb.demo"],
          components: [
            {
              "#": "no_universal_links",
              exclude: true,
              comment:
                "Matches any URL with a fragment that equals no_universal_links and instructs the system not to open it as a universal link.",
            },
            {
              "/": "/mobile-wallet-protocol",
              comment:
                "Matches any URL with a path that starts with /mobile-wallet-protocol for coinbase wallet mobile redirects.",
            },
            {
              "/": "/dashboard/*",
              exclude: true,
              comment: "no universal link for dashboard",
            },
          ],
        },
      ],
    },
    webcredentials: {
      apps: ["XYHGSFAMHX.com.thirdweb.demo"],
    },
    appclips: {},
  });
}
