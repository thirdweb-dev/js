import type { Chain } from "../src/types";
export default {
  "chain": "ETC",
  "chainId": 6,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmawMDPsaj3kBTZErCYQ3tshv5RrMAN3smWNs72m943Fyj",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://ethereumclassic.org/development/testnets",
  "name": "Kotti Testnet",
  "nativeCurrency": {
    "name": "Kotti Ether",
    "symbol": "KOT",
    "decimals": 18
  },
  "networkId": 6,
  "rpc": [],
  "shortName": "kot",
  "slip44": 1,
  "slug": "kotti-testnet",
  "status": "deprecated",
  "testnet": true,
  "title": "Ethereum Classic Kotti Testnet"
} as const satisfies Chain;