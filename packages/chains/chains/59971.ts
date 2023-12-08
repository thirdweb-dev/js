import type { Chain } from "../src/types";
export default {
  "chain": "GCODE",
  "chainId": 59971,
  "explorers": [
    {
      "name": "Genesys Scan",
      "url": "https://genesysscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreihgmpaceze7rxpajv7yrlx3cb6daqubippkpvgryzairtaubsjjoe",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreihgmpaceze7rxpajv7yrlx3cb6daqubippkpvgryzairtaubsjjoe",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://genesyscode.io",
  "name": "Genesys Code Mainnet",
  "nativeCurrency": {
    "name": "GenesysCode",
    "symbol": "GCODE",
    "decimals": 18
  },
  "networkId": 59971,
  "rpc": [
    "https://genesys-code.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://59971.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.genesyscode.io/"
  ],
  "shortName": "gcode",
  "slug": "genesys-code",
  "testnet": false
} as const satisfies Chain;