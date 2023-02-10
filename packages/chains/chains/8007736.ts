export default {
  "name": "Plian Mainnet Subchain 1",
  "chain": "Plian",
  "rpc": [
    "https://mainnet.plian.io/child_0"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "infoURL": "https://plian.org",
  "shortName": "plian-mainnet-l2",
  "chainId": 8007736,
  "networkId": 8007736,
  "explorers": [
    {
      "name": "piscan",
      "url": "https://piscan.plian.org/child_0",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "chain": "eip155-2099156",
    "type": "L2"
  },
  "testnet": false,
  "slug": "plian-subchain-1"
} as const;