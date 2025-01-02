"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { THIRDWEB_API_HOST } from "constants/urls";
import { Star } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";

async function favoriteChains() {
  const res = await fetch(`${THIRDWEB_API_HOST}/v1/chains/favorites`, {
    method: "GET",
  });

  const result = await res.json();

  return (result.data ?? []) as string[];
}

async function addChainToFavorites(chainId: number) {
  const res = await fetch(
    `${THIRDWEB_API_HOST}/v1/chains/${chainId}/favorite`,
    {
      method: "POST",
      // without body - the API returns 400
      body: JSON.stringify({}),
    },
  );
  const result = await res.json();
  return result?.data?.favorite;
}

async function removeChainFromFavorites(chainId: number) {
  const res = await fetch(
    `${THIRDWEB_API_HOST}/v1/chains/${chainId}/favorite`,
    {
      method: "DELETE",
    },
  );
  const result = await res.json();
  return result?.data?.favorite;
}

export function useFavoriteChainIds() {
  const address = useActiveAccount()?.address;
  return useQuery({
    queryKey: ["favoriteChains", address],
    queryFn: () => favoriteChains(),
    enabled: !!address,
  });
}

export function StarButton(props: {
  chainId: number;
  className?: string;
  iconClassName?: string;
  variant?: ButtonProps["variant"];
}) {
  const address = useActiveAccount()?.address;
  const queryClient = useQueryClient();
  const favChainsQuery = useFavoriteChainIds();

  const mutation = useMutation({
    mutationFn: (preferred: boolean) => {
      if (preferred) {
        return removeChainFromFavorites(props.chainId);
      }
      return addChainToFavorites(props.chainId);
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["favoriteChains"],
      });
    },
  });

  const isPreferred =
    mutation.data ?? favChainsQuery.data?.includes(`${props.chainId}`) ?? false;

  const label = isPreferred ? "Remove from Favorites" : "Add to Favorites";

  return (
    <Button
      className={props.className}
      variant={props.variant ?? "ghost"}
      size="icon"
      aria-label={label}
      onClick={() => {
        mutation.mutate(isPreferred);
      }}
      disabled={!address || mutation.isPending || favChainsQuery.isPending}
    >
      <ToolTipLabel label={label}>
        <Star
          className={cn(
            "transition-all",
            props.iconClassName,
            isPreferred ? "text-yellow-400" : "text-foreground",
          )}
          fill={isPreferred ? "currentColor" : "none"}
          strokeWidth="1px"
        />
      </ToolTipLabel>
    </Button>
  );
}
