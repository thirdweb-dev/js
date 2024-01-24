import type { Chain } from "../src/types";
export default {
  "chain": "wan-red-ain",
  "chainId": 1273227453,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://wan-red-ain.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmT5KKrpNt6duU8QfwaYw3xf4ifTBPtjahpWsMi3gsFmcS",
        "width": 440,
        "height": 600,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://dashboard.humanprotocol.org/faucet"
  ],
  "infoURL": "https://www.humanprotocol.org",
  "name": "HUMAN Protocol",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1273227453,
  "rpc": [
    "https://human-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1273227453.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/wan-red-ain"
  ],
  "shortName": "human-mainnet",
  "slug": "human-protocol",
  "testnet": false,
  "title": "HUMAN Protocol"
} as const satisfies Chain;