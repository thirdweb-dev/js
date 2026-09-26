"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { DangerSettingCard } from "@/components/blocks/DangerSettingCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItemButton } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type RevokeSessionsTarget,
  revokeUserWalletSessions,
} from "../api/revoke-sessions";

type IdentifierType = "email" | "phone" | "walletAddress" | "userId";

async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

const identifierOptions: {
  value: IdentifierType;
  label: string;
  placeholder: string;
}[] = [
  { label: "Email", placeholder: "user@example.com", value: "email" },
  { label: "Phone", placeholder: "+15555555555", value: "phone" },
  { label: "Wallet address", placeholder: "0x...", value: "walletAddress" },
  { label: "User ID", placeholder: "User ID", value: "userId" },
];

export function RevokeSessionsCard(props: {
  clientId: string;
  teamId: string;
}) {
  const [scope, setScope] = useState<"user" | "all">("user");
  const [identifierType, setIdentifierType] = useState<IdentifierType>("email");
  const [identifier, setIdentifier] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const selectedOption = identifierOptions.find(
    (option) => option.value === identifierType,
  );
  const isReady =
    secretKey.trim().length > 0 &&
    (scope === "all" || identifier.trim().length > 0);

  const revokeSessions = useMutation({
    mutationFn: async () => {
      const target: RevokeSessionsTarget =
        scope === "all"
          ? { type: "allUsers" }
          : { type: identifierType, value: identifier };
      const result = await revokeUserWalletSessions({
        clientId: props.clientId,
        secretKeyHash: await sha256Hex(secretKey.trim()),
        target,
        teamId: props.teamId,
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to revoke sessions");
    },
    onSuccess: () => {
      setSecretKey("");
      toast.success("Sessions revoked");
    },
  });

  return (
    <DangerSettingCard
      buttonLabel="Revoke sessions"
      buttonOnClick={() => {
        if (isReady) {
          revokeSessions.mutate();
        }
      }}
      confirmationDialog={{
        children: revokeSessions.data ? (
          <Alert className="mt-4" variant="info">
            <AlertTitle>Sessions revoked</AlertTitle>
            <AlertDescription>
              {revokeSessions.data.scope === "project"
                ? "All users"
                : `${revokeSessions.data.userCount} user${revokeSessions.data.userCount === 1 ? "" : "s"}`}{" "}
              signed out as of{" "}
              {new Date(
                revokeSessions.data.tokensInvalidBefore,
              ).toLocaleString()}
              .
            </AlertDescription>
          </Alert>
        ) : null,
        description:
          scope === "all"
            ? "Every user of this project will be signed out of all devices."
            : `${selectedOption?.label}: ${identifier.trim()}`,
        onClose: () => revokeSessions.reset(),
        title:
          scope === "all"
            ? "Revoke sessions for all users?"
            : "Revoke sessions for this user?",
      }}
      description="Sign users out of every device. Existing sessions stop working immediately and users can sign in again."
      isDisabled={!isReady}
      isPending={revokeSessions.isPending}
      title="Revoke sessions"
    >
      <div className="space-y-5">
        <RadioGroup
          className="flex flex-col gap-3 lg:flex-row"
          onValueChange={(value) => setScope(value as "user" | "all")}
          value={scope}
        >
          <RadioGroupItemButton id="revoke-scope-user" value="user">
            A single user
          </RadioGroupItemButton>
          <RadioGroupItemButton id="revoke-scope-all" value="all">
            All users
          </RadioGroupItemButton>
        </RadioGroup>

        {scope === "user" && (
          <div className="flex flex-col gap-3 md:flex-row">
            <Select
              onValueChange={(value) =>
                setIdentifierType(value as IdentifierType)
              }
              value={identifierType}
            >
              <SelectTrigger className="bg-card md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {identifierOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              aria-label={selectedOption?.label}
              className="bg-card"
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={selectedOption?.placeholder}
              value={identifier}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="revoke-sessions-secret-key">Secret key</Label>
          <Input
            autoComplete="off"
            className="bg-card"
            id="revoke-sessions-secret-key"
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Project secret key"
            type="password"
            value={secretKey}
          />
        </div>
      </div>
    </DangerSettingCard>
  );
}
