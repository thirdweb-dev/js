"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StarIcon } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { apiServerProxy } from "@/actions/proxies";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner/Spinner";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

async function favoriteChains() {
  const res = await apiServerProxy<{ data: string[] }>({
    method: "GET",
    pathname: "/v1/chains/favorites",
  });

  if (!res.ok) {
    throw new Error(res.error);
  }

  const result = res.data;
  return result.data ?? [];
}

async function addChainToFavorites(chainId: number) {
  const res = await apiServerProxy({
    body: JSON.stringify({}),
    method: "POST",
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
    method: "DELETE",
    pathname: `/v1/chains/${chainId}/favorite`,
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
    enabled: !!address,
    queryFn: () => favoriteChains(),
    queryKey: ["favoriteChains", address],
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
        aria-label={label}
        className={props.className}
        disabled={mutation.isPending || favChainsQuery.isPending}
        onClick={() => {
          mutation.mutate(isPreferred);
        }}
        size="icon"
        variant={props.variant ?? "ghost"}
      >
        {mutation.isPending ? (
          <Spinner className={cn("size-6", props.iconClassName)} />
        ) : (
          <StarIcon
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
