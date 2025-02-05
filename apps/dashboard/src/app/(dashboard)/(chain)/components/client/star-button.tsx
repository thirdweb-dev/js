"use client";

import { apiServerProxy } from "@/actions/proxies";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";

async function favoriteChains() {
  const res = await apiServerProxy<{ data: string[] }>({
    pathname: "/v1/chains/favorites",
    method: "GET",
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  const result = res.data;
  return result.data ?? [];
}

async function addChainToFavorites(chainId: number) {
  const res = await apiServerProxy({
    method: "POST",
    body: JSON.stringify({}),
    pathname: `/v1/chains/${chainId}/favorite`,
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  const result = res.data as { data?: { favorite: boolean } };
  return result?.data?.favorite;
}

async function removeChainFromFavorites(chainId: number) {
  const res = await apiServerProxy<{ data?: { favorite: boolean } }>({
    pathname: `/v1/chains/${chainId}/favorite`,
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  const result = res.data;
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
    <ToolTipLabel label={label} side="right">
      <Button
        className={props.className}
        variant={props.variant ?? "ghost"}
        size="icon"
        aria-label={label}
        onClick={() => {
          mutation.mutate(isPreferred);
        }}
        disabled={mutation.isPending || favChainsQuery.isPending}
      >
        {mutation.isPending ? (
          <Spinner className={cn("size-6", props.iconClassName)} />
        ) : (
          <Star
            className={cn(
              "size-6 text-foreground transition-all",
              props.iconClassName,
            )}
            fill={isPreferred ? "currentColor" : "none"}
            strokeWidth="1px"
          />
        )}
      </Button>
    </ToolTipLabel>
  );
}
