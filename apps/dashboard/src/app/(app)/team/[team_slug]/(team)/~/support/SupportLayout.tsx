"use client";

import type { Team } from "@/api/team";
import { cn } from "@/lib/utils";
import type { Account } from "@/hooks/useApi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ThirdwebClient } from "thirdweb";
import { CustomChatButton } from "@/components/chat/CustomChatButton";

export function SupportLayout(props: {
  team: Team;
  children: React.ReactNode;
  account: Account;
  client: ThirdwebClient;
  authToken?: string;
}) {
  const [_showFullNavOnMobile] = useState(true);
  const pathname = usePathname();
  const isSupportOverview = (pathname || "").endsWith("/~/support");
  const showFullNavOnMobile = _showFullNavOnMobile && isSupportOverview;

  return (
    <div className="flex grow flex-col">
      {/* Page header */}
      <div className="border-border border-b py-10">
        <div className="container flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="ml-4 font-semibold text-3xl tracking-tight">
              Support Portal
            </h1>
            <p className="mt-2 ml-4 text-[#737373]">
              Create and view support cases for your projects.{" "}
              <Link
                href=""
                target="_blank"
                className="inline-flex items-center text-[#c6c7f8] hover:underline"
              >
                Learn more
              </Link>
            </p>
          </div>

          <div>
            <CustomChatButton
              authToken={props.authToken}
              clientId={undefined}
              examplePrompts={[
                "How do I integrate thirdweb SDK?",
                "What are the best practices for smart contracts?",
                "How to set up wallet connection?",
                "Troubleshooting deployment issues"
              ]}
              isFloating={false}
              isLoggedIn={!!props.account}
              label="Ask Nebula AI for support"
              networks="all"
              pageType="support"
              teamId={props.team.id}
            />
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="container flex grow gap-8 lg:min-h-[900px] [&>*]:py-8 lg:[&>*]:py-10">
        <div
          className={cn(
            "flex max-w-full grow flex-col",
            showFullNavOnMobile && "max-sm:hidden",
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}