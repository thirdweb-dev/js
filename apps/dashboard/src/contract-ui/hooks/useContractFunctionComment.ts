import { useThirdwebClient } from "@/constants/thirdweb.client";
import { useQuery } from "@tanstack/react-query";
import type { ThirdwebContract } from "thirdweb";
import { getCompilerMetadata } from "thirdweb/contract";
import { download } from "thirdweb/storage";

/**
 * Try to extract the description (or comment) about a contract's method from our contract metadata endpoint
 *
 * An example of a contract that has both userdoc and devdoc:
 * https://contract.thirdweb.com/metadata/1/0x303a465B659cBB0ab36eE643eA362c509EEb5213
 */
export function useContractFunctionComment(
  contract: ThirdwebContract,
  functionName: string,
) {
  const client = useThirdwebClient();
  return useQuery({
    queryKey: [
      "contract-function-comment",
      contract?.chain.id || "",
      contract?.address || "",
      functionName,
    ],
    queryFn: async (): Promise<string> => {
      const data = await getCompilerMetadata(contract);
      let comment = "";
      /**
       * If the response data contains userdoc and/or devdoc
       * we always prioritize using them. parsing the comment using regex should
       * always be the last resort
       */
      if (data.metadata.output.devdoc?.methods) {
        const keys = Object.keys(data.metadata.output.devdoc.methods);
        const matchingKey = keys.find(
          (rawKey) =>
            rawKey.startsWith(functionName) &&
            rawKey.split("(")[0] === functionName,
        );
        const devDocContent = matchingKey
          ? data.metadata.output.devdoc.methods[matchingKey]?.details
          : undefined;
        if (devDocContent) {
          comment += `@dev-doc: ${devDocContent}\n`;
        }
      }
      if (data.metadata.output.userdoc?.methods) {
        const keys = Object.keys(data.metadata.output.userdoc.methods);
        const matchingKey = keys.find(
          (rawKey) =>
            rawKey.startsWith(functionName) &&
            rawKey.split("(")[0] === functionName,
        );
        const userDocContent = matchingKey
          ? data.metadata.output.userdoc.methods[matchingKey]?.notice
          : undefined;
        if (userDocContent) {
          comment += `@user-doc: ${userDocContent}\n`;
        }
      }
      if (comment) {
        return comment;
      }
      if (!data.metadata.sources) {
        return "";
      }
      const sources = await Promise.all(
        Object.entries(data.metadata.sources).map(async ([path, info]) => {
          if ("content" in info) {
            return {
              filename: path,
              source: info.content || "Could not find source for this file",
            };
          }
          const urls = info.urls;
          const ipfsLink = urls
            ? urls.find((url) => url.includes("ipfs"))
            : undefined;
          if (ipfsLink) {
            const ipfsHash = ipfsLink.split("ipfs/")[1];
            const source = await download({
              uri: `ipfs://${ipfsHash}`,
              client,
            })
              .then((r) => r.text())
              .catch(() => "Failed to fetch source from IPFS");
            return {
              filename: path,
              source,
            };
          }
          return {
            filename: path,
            source: "Could not find source for this file",
          };
        }),
      );
      const file = sources.find((item) => item.source.includes(functionName));
      if (!file) {
        return "";
      }
      return extractFunctionComment(file.source, functionName);
    },
  });
}

function extractFunctionComment(
  // The whole code from the solidity file containing (possibly) the function
  solidityCode: string,
  functionName: string,
): string {
  // Regular expression to match function declarations and their preceding comments
  // This regex now captures both single-line (//) and multi-line (/** */) comments
  const functionRegex =
    /(?:\/\/[^\n]*|\/\*\*[\s\S]*?\*\/)\s*function\s+(\w+)\s*\(/g;

  while (true) {
    const match = functionRegex.exec(solidityCode);
    if (match === null) {
      return "";
    }
    const [fullMatch, name] = match;
    if (!fullMatch || !fullMatch.length) {
      return "";
    }
    if (name === functionName) {
      // Extract the comment part
      const comment = (fullMatch.split("function")[0] || "").trim();
      if (!comment) {
        return "";
      }

      if (/^[^a-zA-Z0-9]+$/.test(comment)) {
        return "";
      }
      return comment;
    }
  }
}
