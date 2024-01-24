import type { Chain } from "../src/types";
export default {
  "chain": "staging-fast-active-bellatrix",
  "chainId": 1351057110,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-fast-active-bellatrix.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmbYYCoU2G4LUfRr9ofGowF3eatfvWv9FiPVhqKndZeqwA",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://sfuel.skale.network/staging/chaos"
  ],
  "infoURL": "https://docs.skale.network/develop/",
  "name": "Chaos (SKALE Testnet)",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 1351057110,
  "rpc": [
    "https://chaos-skale-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1351057110.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-fast-active-bellatrix"
  ],
  "shortName": "chaos-tenet",
  "slip44": 1,
  "slug": "chaos-skale-testnet",
  "testnet": true,
  "title": "Chaos Testnet"
} as const satisfies Chain;