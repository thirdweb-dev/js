import type { Chain } from "../src/types";
export default {
  "chain": "AgentLayer",
  "chainId": 42072,
  "explorers": [
    {
      "name": "AgentLayer Testnet Explorer",
      "url": "https://testnet-explorer.agentlayer.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmSj6SSWmBiRjnjZQPb17kvhGDmB9xAGRkG13RwPuXLTCT",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://agentlayer.xyz/home",
  "name": "AgentLayer Testnet",
  "nativeCurrency": {
    "name": "Agent",
    "symbol": "AGENT",
    "decimals": 18
  },
  "networkId": 42072,
  "rpc": [
    "https://42072.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.agentlayer.xyz"
  ],
  "shortName": "agent",
  "slug": "agentlayer-testnet",
  "testnet": true
} as const satisfies Chain;