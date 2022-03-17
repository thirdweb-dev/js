import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "invalid method" });
  }

  const { address, chainName } = req.body;

  if (!address || !chainName) {
    return res.status(400).json({ error: "must provide network and address" });
  }

  const url = `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chainName}&format=decimal`;
  const assetsResponse = await fetch(url, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "X-API-Key": process.env.MORALIS_API_KEY,
    } as HeadersInit,
  });
  const assets = await assetsResponse.json();

  const erc721 = assets.result?.filter(
    (asset: any) => asset.contract_type === "ERC721",
  );

  const erc721WithMetadata = erc721?.map(async (asset: any) => {
    if (asset.token_uri) {
      const ipfsUri = asset.token_uri.split("/ipfs/")[1];
      const uri = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/${ipfsUri}`;
      try {
        const resImage = await fetch(uri);
        const metadata = await resImage.json();
        const metadataWithImage = {
          ...metadata,
          image: metadata.image.replace(
            "ipfs://",
            `${process.env.NEXT_PUBLIC_IPFS_GATEWAY_URL}/`,
          ),
        };

        return {
          ...asset,
          metadata: metadataWithImage,
        };
      } catch {
        console.warn("Failed to fetch...");
      }
    }

    return asset;
  });

  const assetsWithMetadata = await Promise.all(erc721WithMetadata);
  return res.status(assetsResponse.status).json(assetsWithMetadata);
};
