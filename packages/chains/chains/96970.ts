import type { Chain } from "../src/types";
export default {
  "chainId": 96970,
  "chain": "Mantis",
  "name": "Mantis Testnet (Hexapod)",
  "rpc": [
    "https://mantis-testnet-hexapod.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mantis-rpc.switch.ch",
    "https://mantis-rpc.kore-technologies.ch",
    "https://mantis-rpc.phoenix-systems.io"
  ],
  "slug": "mantis-testnet-hexapod",
  "icon": {
    "url": "ipfs://Qma8dDhxSSVUyzV8Pu5bo252WaZEEikYFndRh7LVktvQEy",
    "width": 512,
    "height": 330,
    "format": "png"
  },
  "faucets": [
    "https://mantis.switch.ch/faucet",
    "https://mantis.kore-technologies.ch/faucet",
    "https://mantis.phoenix-systems.io/faucet",
    "https://mantis.block-spirit.ch/faucet"
  ],
  "nativeCurrency": {
    "name": "Mantis",
    "symbol": "MANTIS",
    "decimals": 18
  },
  "infoURL": "https://hexapod.network",
  "shortName": "mantis",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mantis Blockscout",
      "url": "https://blockscout.mantis.hexapod.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;