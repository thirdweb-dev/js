"use client";

import { format } from "date-fns";
import type { ThirdwebClient } from "thirdweb";
import type { WalletUser } from "thirdweb/wallets";
import { WalletAddress } from "@/components/blocks/wallet-address";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const getUserIdentifier = (user: WalletUser) => {
  const mainDetail = user.linkedAccounts[0]?.details;
  return (
    mainDetail?.email ??
    mainDetail?.phone ??
    mainDetail?.address ??
    mainDetail?.id ??
    user.id
  );
};

export function SearchResults(props: {
  results: WalletUser[];
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
      {props.results.map((user) => {
        const walletAddress = user.wallets?.[0]?.address;
        const createdAt = user.wallets?.[0]?.createdAt;
        const mainDetail = user.linkedAccounts?.[0]?.details;
        const email = mainDetail?.email as string | undefined;
        const phone = mainDetail?.phone as string | undefined;

        // Get external wallet addresses from linkedAccounts where type is 'siwe'
        const externalWalletAccounts =
          user.linkedAccounts?.filter((account) => account.type === "siwe") ||
          [];

        return (
          <Card key={user.id}>
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

                {walletAddress && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Wallet Address
                    </p>
                    <WalletAddress
                      address={walletAddress}
                      client={props.client}
                    />
                  </div>
                )}

                {email && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{email}</p>
                  </div>
                )}

                {phone && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <p className="text-sm">{phone}</p>
                  </div>
                )}

                {externalWalletAccounts.length > 0 && (
                  <div className="col-span-full">
                    <p className="text-sm font-medium text-muted-foreground">
                      External Wallets
                    </p>
                    <div className="space-y-1">
                      {externalWalletAccounts.map((account, index) => {
                        const address = account.details?.address as
                          | string
                          | undefined;
                        return address ? (
                          <div key={`${user.id}-external-${index}`}>
                            <WalletAddress
                              address={address}
                              client={props.client}
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {createdAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Created
                    </p>
                    <p className="text-sm">
                      {format(new Date(createdAt), "MMM dd, yyyy")}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Login Methods
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {user.linkedAccounts?.map((account, index) => (
                      <TooltipProvider
                        key={`${user.id}-${account.type}-${index}`}
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
        );
      })}
    </div>
  );
}
