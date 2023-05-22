import type { Chain } from "../src/types";
export default {
  "name": "Chaos (SKALE Testnet)",
  "title": "Chaos Testnet",
  "chain": "staging-fast-active-bellatrix",
  "rpc": [
    "https://chaos-skale-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix"
  ],
  "faucets": [
    "https://sfuel.skale.network/staging/chaos"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://docs.skale.network/develop/",
  "shortName": "chaos-tenet",
  "chainId": 1351057110,
  "networkId": 1351057110,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com",
      "icon": {
        "url": "ipfs://QmbYYCoU2G4LUfRr9ofGowF3eatfvWv9FiPVhqKndZeqwA",
        "width": 400,
        "height": 400,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "chaos-skale-testnet"
} as const satisfies Chain;