import type { Chain } from "../src/types";
export default {
  "chain": "Mantis",
  "chainId": 96970,
  "explorers": [
    {
      "name": "Mantis Blockscout",
      "url": "https://blockscout.mantis.hexapod.network",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://mantis.switch.ch/faucet",
    "https://mantis.kore-technologies.ch/faucet",
    "https://mantis.phoenix-systems.io/faucet",
    "https://mantis.block-spirit.ch/faucet"
  ],
  "icon": {
    "url": "ipfs://Qma8dDhxSSVUyzV8Pu5bo252WaZEEikYFndRh7LVktvQEy",
    "width": 512,
    "height": 330,
    "format": "png"
  },
  "infoURL": "https://hexapod.network",
  "name": "Mantis Testnet (Hexapod)",
  "nativeCurrency": {
    "name": "Mantis",
    "symbol": "MANTIS",
    "decimals": 18
  },
  "networkId": 96970,
  "rpc": [
    "https://96970.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mantis-rpc.switch.ch",
    "https://mantis-rpc.kore-technologies.ch",
    "https://mantis-rpc.phoenix-systems.io"
  ],
  "shortName": "mantis",
  "slip44": 1,
  "slug": "mantis-testnet-hexapod",
  "testnet": true
} as const satisfies Chain;