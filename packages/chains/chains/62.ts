import type { Chain } from "../src/types";
export default {
  "chain": "ETC",
  "chainId": 62,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmawMDPsaj3kBTZErCYQ3tshv5RrMAN3smWNs72m943Fyj",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://ethereumclassic.org/development/testnets",
  "name": "Morden Testnet",
  "nativeCurrency": {
    "name": "Morden Ether",
    "symbol": "TETC",
    "decimals": 18
  },
  "networkId": 2,
  "rpc": [],
  "shortName": "tetc",
  "slip44": 1,
  "slug": "morden-testnet",
  "status": "deprecated",
  "testnet": true,
  "title": "Ethereum Classic Morden Testnet"
} as const satisfies Chain;