import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { utils } from "ethers";
import { useSingleQueryParam } from "hooks/useQueryParam";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Text } from "tw-components";
import { shortenIfAddress } from "utils/usedapp-external";

export const Breadcrumbs: React.FC = () => {
  const { asPath } = useRouter();
  const wallet = useSingleQueryParam("wallet") || "dashboard";

  const cleanAsPath = useMemo(() => {
    return asPath.split("?")[0];
  }, [asPath]);

  const crumbs = useMemo(() => {
    const asArray = cleanAsPath.split("/");

    const _crumbs: Array<{ name: JSX.Element; path: string }> = [];

    for (let i = 1; i < asArray.length; i = i + 2) {
      const title = asArray[i].split("-").join(" ").replace("nft", "NFT");
      const _address = utils.isAddress(asArray[i + 1])
        ? shortenIfAddress(asArray[i + 1])
        : "";
      if (_address) {
        _crumbs.push({
          name: (
            <>
              {title}{" "}
              <Text as="span" fontFamily="mono">
                {_address ? ` (${_address})` : ""}
              </Text>
            </>
          ),
          path: `${asArray.slice(0, i + 2).join("/")}`,
        });
      }
    }
    return _crumbs;
  }, [cleanAsPath]);

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb
      display={{ base: "none", md: "block" }}
      separator={<ChevronRightIcon color="gray.500" />}
      mb={8}
    >
      <BreadcrumbItem>
        <NextLink href={`/${wallet}`} passHref>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </NextLink>
      </BreadcrumbItem>
      {crumbs.map((crumb) => (
        <BreadcrumbItem key={crumb.path}>
          <NextLink href={crumb.path} passHref>
            <BreadcrumbLink
              isCurrentPage={cleanAsPath === crumb.path}
              _activeLink={{ fontWeight: "bold" }}
              textTransform="capitalize"
            >
              {crumb.name}
            </BreadcrumbLink>
          </NextLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
