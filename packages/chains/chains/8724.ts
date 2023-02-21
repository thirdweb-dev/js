export default {
  "name": "TOOL Global Testnet",
  "chain": "OLO",
  "rpc": [
    "https://tool-global-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-web3.wolot.io"
  ],
  "faucets": [
    "https://testnet-explorer.wolot.io"
  ],
  "nativeCurrency": {
    "name": "TOOL Global",
    "symbol": "OLO",
    "decimals": 18
  },
  "infoURL": "https://testnet-explorer.wolot.io",
  "shortName": "tolo",
  "chainId": 8724,
  "networkId": 8724,
  "slip44": 479,
  "testnet": true,
  "slug": "tool-global-testnet"
} as const;