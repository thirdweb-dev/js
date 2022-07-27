import { PROTOCOL_CONTROL_ABI } from "../abis/protocol-control";
import { REGISTRY_ABI } from "../abis/registry";
import { useQuery } from "@tanstack/react-query";
import { SUPPORTED_CHAIN_ID } from "@thirdweb-dev/sdk";
import { alchemyUrlMap } from "components/app-layouts/providers";
import { ethers, providers } from "ethers";
import { SUPPORTED_CHAIN_IDS_V1 } from "utils/network";

const REGISTRY_ADDRESS = "0x902a29f2cfe9f8580ad672AaAD7E917d85ca9a2E";

export function useProjects(address?: string) {
  const getApps = async (chainId: SUPPORTED_CHAIN_ID) => {
    const provider = new providers.JsonRpcProvider(
      alchemyUrlMap[chainId as SUPPORTED_CHAIN_ID],
    );

    const registry = new ethers.Contract(
      REGISTRY_ADDRESS,
      REGISTRY_ABI,
      provider,
    );

    const maxVersion = await registry.getProtocolControlCount(address);

    const versions = Array.from(Array(maxVersion.toNumber()).keys()).reverse();
    const addresses = await Promise.all(
      versions.map((v) =>
        registry.getProtocolControl(address, (v + 1).toString()),
      ),
    );

    const metadatas = await Promise.all(
      addresses.map(async (a) => {
        const protocolControl = new ethers.Contract(
          a,
          PROTOCOL_CONTROL_ABI,
          provider,
        );

        const uri = await protocolControl.contractURI();
        const gateway = uri.replace(
          "ipfs://",
          "https://gateway.ipfscdn.io/ipfs/",
        );
        const metadata = await fetch(gateway).then((r) => r.json());

        return {
          address: a,
          name: metadata.name || "N/A",
          chainId,
        };
      }),
    );

    return metadatas;
  };

  return useQuery(
    ["projects", { address }],
    async () => {
      const projects = await Promise.all(
        SUPPORTED_CHAIN_IDS_V1.map(async (cId) => getApps(cId)),
      );

      return projects.reduce((a, b) => [...a, ...b], []);
    },
    {
      enabled: !!address,
    },
  );
}
