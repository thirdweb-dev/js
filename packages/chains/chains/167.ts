export default {
  "name": "Atoshi Testnet",
  "chain": "ATOSHI",
  "icon": {
    "url": "ipfs://QmfFK6B4MFLrpSS46aLf7hjpt28poHFeTGEKEuH248Tbyj",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "rpc": [
    "https://atoshi-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.atoshi.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ATOSHI",
    "symbol": "ATOS",
    "decimals": 18
  },
  "infoURL": "https://atoshi.org",
  "shortName": "atoshi",
  "chainId": 167,
  "networkId": 167,
  "explorers": [
    {
      "name": "atoshiscan",
      "url": "https://scan.atoverse.info",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "atoshi-testnet"
} as const;