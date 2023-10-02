import type { Chain } from "../src/types";
export default {
  "chain": "honorable-steel-rasalhague",
  "chainId": 1564830818,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev"
  ],
  "features": [],
  "infoURL": "https://calypsohub.network/",
  "name": "Calypso NFT Hub (SKALE)",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://calypso-nft-hub-skale.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
  ],
  "shortName": "calypso-mainnet",
  "slug": "calypso-nft-hub-skale",
  "testnet": false
} as const satisfies Chain;