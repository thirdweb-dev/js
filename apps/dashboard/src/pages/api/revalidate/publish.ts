import { QueryClient } from "@tanstack/react-query";
import {
  ensQuery,
  fetchPublishedContracts,
} from "components/contract-components/hooks";
import type { ENSResolveResult } from "lib/ens";
import { getDashboardChainRpc } from "lib/rpc";
import { getThirdwebSDK } from "lib/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import { polygon } from "thirdweb/chains";
import { getSingleQueryValue } from "utils/router";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const ensNameOrAddress = getSingleQueryValue(req.query, "address");
  const contractName = getSingleQueryValue(req.query, "contractName");
  if (!ensNameOrAddress) {
    return res.status(400).json({ message: "address must be provided" });
  }

  let ensResult: ENSResolveResult;
  try {
    ensResult = await ensQuery(ensNameOrAddress).queryFn();
  } catch (err) {
    return res.status(500).json({ message: (err as Error).message });
  }

  const pathsToRevalidate: string[] = [];
  if (ensResult.address) {
    pathsToRevalidate.push(`/${ensResult.address}`);
    if (contractName) {
      pathsToRevalidate.push(`/${ensResult.address}/${contractName}`);
    }
  }
  if (ensResult.ensName) {
    pathsToRevalidate.push(`/${ensResult.ensName}`);
    if (contractName) {
      pathsToRevalidate.push(`/${ensResult.ensName}/${contractName}`);
    }
  }

  // if we don't have a specific contractName we have to actually fetch all the contracts for the address
  if (!contractName) {
    const polygonSdk = getThirdwebSDK(
      polygon.id,
      getDashboardChainRpc(polygon.id),
    );
    const publishedContracts = await fetchPublishedContracts(
      polygonSdk,
      new QueryClient(),
      ensResult.address,
    );

    publishedContracts.map((contract) => {
      if (ensResult.address) {
        pathsToRevalidate.push(`/${ensResult.address}/${contract.id}`);
      }
      if (ensResult.ensName) {
        pathsToRevalidate.push(`/${ensResult.address}/${contract.id}`);
      }
    });
  }

  try {
    await Promise.all(pathsToRevalidate.map((path) => res.revalidate(path)));
    return res.json({ revalidated: true });
  } catch (err) {
    console.error("revalidation failed", err);
    return res.status(500).send("Error revalidating");
  }
};

export default handler;
