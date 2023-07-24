import type { Chain } from "../src/types";
export default {
  "name": "Mantis Testnet (Hexapod)",
  "chain": "Mantis",
  "icon": {
    "url": "ipfs://Qma8dDhxSSVUyzV8Pu5bo252WaZEEikYFndRh7LVktvQEy",
    "width": 512,
    "height": 330,
    "format": "png"
  },
  "rpc": [
    "https://mantis-testnet-hexapod.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mantis-rpc.switch.ch",
    "https://mantis-rpc.kore-technologies.ch",
    "https://mantis-rpc.phoenix-systems.io"
  ],
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
  "chainId": 96970,
  "networkId": 96970,
  "explorers": [
    {
      "name": "Mantis Blockscout",
      "url": "https://blockscout.mantis.hexapod.network",
      "icon": {
        "url": "ipfs://bafybeifu5tpui7dk5cjoo54kde7pmuthvnl7sdykobuarsxgu7t2izurnq",
        "width": 512,
        "height": 512,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "mantis-testnet-hexapod"
} as const satisfies Chain;