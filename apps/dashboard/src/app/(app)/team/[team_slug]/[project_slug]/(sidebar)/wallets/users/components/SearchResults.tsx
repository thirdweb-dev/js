"use client";

import { format } from "date-fns";
import type { ThirdwebClient } from "thirdweb";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserSearchResult } from "./types";

const getUserIdentifier = (user: UserSearchResult) => {
  return user.email ?? user.phone ?? user.walletAddress ?? user.userId;
};

export function SearchResults(props: {
  results: UserSearchResult[];
  client: ThirdwebClient;
}) {
  if (props.results.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm">No users found</p>
            <p className="text-muted-foreground text-sm">
              Try searching with different criteria
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {props.results.map((user) => (
        <Card key={user.userId}>
          <CardHeader>
            <CardTitle className="text-lg">User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User Identifier
                </p>
                <p className="text-sm">{getUserIdentifier(user)}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Wallet Address
                </p>
                <WalletAddress
                  address={user.walletAddress}
                  client={props.client}
                />
              </div>

              {user.email && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm">{user.email}</p>
                </div>
              )}

              {user.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm">{user.phone}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p className="text-sm">
                  {format(new Date(user.createdAt), "MMM dd, yyyy")}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Login Methods
                </p>
                <div className="flex flex-wrap gap-1">
                  {user.linkedAccounts.map((account, index) => (
                    <TooltipProvider
                      key={`${user.userId}-${account.type}-${index}`}
                    >
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="text-xs">
                            {account.type}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm space-y-1">
                            {Object.entries(account.details).map(
                              ([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span>{" "}
                                  {String(value)}
                                </div>
                              ),
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
