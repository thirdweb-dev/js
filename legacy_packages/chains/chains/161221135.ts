import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 161221135,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer.plumenetwork.xyz",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNUpqkYWYJoDXKUpZ8FVbGyN6HCwxYonKNAieCf2oTzGn",
    "width": 1062,
    "height": 1062,
    "format": "png"
  },
  "infoURL": "https://www.plumenetwork.xyz/",
  "name": "Plume Testnet",
  "nativeCurrency": {
    "name": "Plume Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 161221135,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://testnet-bridge.plumenetwork.xyz"
      }
    ]
  },
  "rpc": [
    "https://161221135.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.plumenetwork.xyz/http",
    "wss://testnet-rpc.plumenetwork.xyz/ws"
  ],
  "shortName": "plume-testnet",
  "slip44": 1,
  "slug": "plume-testnet",
  "testnet": true,
  "title": "Plume Sepolia Rollup Testnet"
} as const satisfies Chain;