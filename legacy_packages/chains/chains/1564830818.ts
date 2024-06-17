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
  "infoURL": "https://calypsohub.network/",
  "name": "SKALE Calypso Hub",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1564830818,
  "rpc": [
    "https://1564830818.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
  ],
  "shortName": "calypso-mainnet",
  "slug": "skale-calypso-hub",
  "testnet": false
} as const satisfies Chain;