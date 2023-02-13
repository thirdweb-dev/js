export default {
  "name": "Ella the heart",
  "chain": "ella",
  "icon": {
    "url": "ipfs://QmVkAhSaHhH3wKoLT56Aq8dNyEH4RySPEpqPcLwsptGBDm",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://ella-the-heart.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ella.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ella",
    "symbol": "ELLA",
    "decimals": 18
  },
  "infoURL": "https://ella.network",
  "shortName": "ELLA",
  "chainId": 7027,
  "networkId": 7027,
  "explorers": [
    {
      "name": "Ella",
      "url": "https://ella.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ella-the-heart"
} as const;