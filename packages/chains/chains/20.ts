export default {
  "name": "Elastos Smart Chain",
  "chain": "ETH",
  "rpc": [
    "https://elastos-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.elastos.io/eth"
  ],
  "faucets": [
    "https://faucet.elastos.org/"
  ],
  "nativeCurrency": {
    "name": "Elastos",
    "symbol": "ELA",
    "decimals": 18
  },
  "infoURL": "https://www.elastos.org/",
  "shortName": "esc",
  "chainId": 20,
  "networkId": 20,
  "explorers": [
    {
      "name": "elastos esc explorer",
      "url": "https://esc.elastos.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "elastos-smart-chain"
} as const;