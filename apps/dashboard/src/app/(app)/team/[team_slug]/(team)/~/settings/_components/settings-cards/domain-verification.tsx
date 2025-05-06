"use client";

import {
  type VerifiedDomainResponse,
  checkDomainVerification,
  createDomainVerification,
} from "@/api/verified-domain";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react";
import { useState } from "react";

interface DomainVerificationFormProps {
  teamId: string;
  initialVerification: VerifiedDomainResponse | null;
  isOwnerAccount: boolean;
}

export function TeamDomainVerificationCard({
  initialVerification,
  isOwnerAccount,
  teamId,
}: DomainVerificationFormProps) {
  const [domain, setDomain] = useState("");
  const queryClient = useQueryClient();

  const domainQuery = useQuery({
    queryKey: ["domain-verification", teamId],
    queryFn: () => checkDomainVerification(teamId),
    initialData: initialVerification,
    refetchInterval: (query) => {
      // if the data is pending, refetch every 10 seconds
      if (query.state.data?.status === "pending") {
        return 10000;
      }
      // if the data is verified, don't refetch ever
      return false;
    },
  });

  const verificationMutation = useMutation({
    mutationFn: async (params: { teamId: string; domain: string }) => {
      const res = await createDomainVerification(params.teamId, params.domain);
      if ("error" in res) {
        throw new Error(res.error);
      }
      return res;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["domain-verification", teamId], data);
    },
  });

  // Get the appropriate bottom text based on verification status
  const getBottomText = () => {
    if (!domainQuery.data) {
      return "Domains must be verified before use.";
    }

    if (domainQuery.data.status === "pending") {
      return "Your domain verification is pending. Please add the DNS record to complete verification.";
    }

    return `Domain ${domainQuery.data.domain} has been successfully verified.`;
  };

  // Render the content for the settings card
  const renderContent = () => {
    // Initial state - show domain input form
    if (!domainQuery.data) {
      return (
        <div>
          <Input
            id="domain"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={!isOwnerAccount || verificationMutation.isPending}
            // is the max length for a domain
            maxLength={253}
            className="md:w-[450px]"
          />
          <p className="mt-2 text-muted-foreground text-sm">
            Enter the domain you want to verify. Do not include http(s):// or
            www.
          </p>
        </div>
      );
    }

    // Pending verification state
    if (domainQuery.data.status === "pending") {
      return (
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Domain</h3>
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 font-medium text-xs text-yellow-800">
                Pending
              </span>
            </div>
            <p className="mt-1 font-medium">{domainQuery.data.domain}</p>
          </div>

          <div className="space-y-4">
            <p>
              Before we can verify <b>{domainQuery.data.domain}</b>, you need to
              add the following DNS TXT record:
            </p>

            <div className="grid gap-4">
              <div>
                <h4 className="mb-1 text-muted-foreground text-xs">
                  Name / Host / Alias
                </h4>

                <div className="flex items-center gap-2 break-all font-mono text-sm">
                  <span className="flex items-center gap-2 rounded-md bg-muted p-2">
                    {domainQuery.data.dnsSublabel}{" "}
                    <CopyButton text={domainQuery.data.dnsSublabel} />
                  </span>
                  <span>.{domainQuery.data.domain}</span>
                </div>
              </div>

              <div>
                <h4 className="mb-1 text-muted-foreground text-xs">
                  Value / Content
                </h4>
                <div className="flex items-center gap-2 break-all font-mono text-sm">
                  <span className="flex items-center gap-2 rounded-md bg-muted p-2">
                    {domainQuery.data.dnsValue}{" "}
                    <CopyButton text={domainQuery.data.dnsValue} />
                  </span>
                </div>
              </div>
            </div>

            <Alert variant="info">
              <AlertCircleIcon className="size-4" />
              <AlertTitle>
                DNS changes can take up to 48 hours to propagate.
              </AlertTitle>
              <AlertDescription>
                We'll automatically check the status periodically. You can
                manually check the status by clicking the button below.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => domainQuery.refetch()}
              disabled={domainQuery.isFetching}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {domainQuery.isFetching && <Spinner className="size-4" />}
              {domainQuery.isFetching
                ? "Checking Status..."
                : "Check Status Now"}
            </Button>
          </div>
        </div>
      );
    }

    // Verified state
    return (
      <div>
        <div className="flex items-center justify-between">
          <div className="mt-2 flex items-start space-x-3">
            <CheckCircleIcon className="mt-0.5 h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium">{domainQuery.data.domain}</p>
              <p className="text-muted-foreground text-sm">
                Verified on{" "}
                {new Date(domainQuery.data.verifiedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-800 text-xs">
            Verified
          </span>
        </div>
      </div>
    );
  };

  return (
    <SettingsCard
      header={{
        title: "Domain Verification",
        description: "Verify your domain to enable advanced features.",
      }}
      errorText={
        verificationMutation.error?.message || domainQuery.error?.message
      }
      noPermissionText={
        domainQuery.data?.status === "pending"
          ? !isOwnerAccount
            ? "Only team owners can verify domains"
            : undefined
          : undefined
      }
      bottomText={getBottomText()}
      saveButton={
        !domainQuery.data
          ? {
              onClick: () =>
                verificationMutation.mutate({
                  teamId,
                  domain,
                }),
              disabled: !domain || verificationMutation.isPending,
              isPending: verificationMutation.isPending,
              label: "Verify Domain",
            }
          : undefined
      }
    >
      {renderContent()}
    </SettingsCard>
  );
}
