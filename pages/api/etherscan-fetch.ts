import { ChainId } from "@thirdweb-dev/sdk";
import { apiKeyMap, apiMap } from "lib/maps";
import { NextApiRequest, NextApiResponse } from "next";

export type EtherscanResult = {
  SourceCode: string;
  ABI: string;
  ContractName: string;
  CompilerVersion: string;
  OptimizationUsed: string;
  Runs: string;
  ConstructorArguments: string;
  EVMVersion: string;
  Library: string;
  LicenseType: string;
  Proxy: string;
  Implementation: string;
  SwarmSource: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "invalid method" });
  }

  const contractAddress = req.query["contractAddress"];
  const chainId = Number(req.query["chainId"]) as ChainId;

  if (!contractAddress) {
    return res.status(400).json({ error: "invalid contract address" });
  }

  if (!apiMap[chainId]) {
    return res.status(400).json({ error: "invalid chainId" });
  }

  const endpoint = `${apiMap[chainId]}?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKeyMap[chainId]}"`;

  try {
    const result = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    const data = await result.json();
    const etherscanResult = data.result[0] as EtherscanResult;
    if (etherscanResult.ABI === "Contract source code not verified") {
      return res
        .status(404)
        .json({ error: "Contract source code not verified on etherscan" });
    }
    return res.status(200).json({ result: etherscanResult });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default handler;
