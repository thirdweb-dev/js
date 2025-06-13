import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      relation: [
        "delegate_permission/common.handle_all_urls",
        "delegate_permission/common.get_login_creds",
      ],
      target: {
        namespace: "android_app",
        package_name: "com.thirdweb.demo",
        sha256_cert_fingerprints: [
          "40:EB:0D:96:57:F3:D8:1F:BA:87:B8:E4:26:E0:3A:DB:C8:35:96:A8:A2:B2:55:F0:B1:64:F1:39:F8:6F:7E:EB",
        ],
      },
    },
  ]);
}
