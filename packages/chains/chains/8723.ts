export default {
  "name": "TOOL Global Mainnet",
  "chain": "OLO",
  "rpc": [
    "https://tool-global.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-web3.wolot.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TOOL Global",
    "symbol": "OLO",
    "decimals": 18
  },
  "infoURL": "https://ibdt.io",
  "shortName": "olo",
  "chainId": 8723,
  "networkId": 8723,
  "slip44": 479,
  "explorers": [
    {
      "name": "OLO Block Explorer",
      "url": "https://www.olo.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "tool-global"
} as const;