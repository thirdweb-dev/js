export default {
  "name": "VChain Mainnet",
  "chain": "VChain",
  "rpc": [
    "https://vchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bc.vcex.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "VNDT",
    "symbol": "VNDT",
    "decimals": 18
  },
  "infoURL": "https://bo.vcex.xyz/",
  "shortName": "VChain",
  "chainId": 2223,
  "networkId": 2223,
  "explorers": [
    {
      "name": "VChain Scan",
      "url": "https://scan.vcex.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "vchain"
} as const;