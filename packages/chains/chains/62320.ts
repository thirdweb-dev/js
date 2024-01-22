import type { Chain } from "../src/types";
export default {
  "chain": "CELO",
  "chainId": 62320,
  "explorers": [],
  "faucets": [
    "https://docs.google.com/forms/d/e/1FAIpQLSdfr1BwUTYepVmmvfVUDRCwALejZ-TUva2YujNpvrEmPAX2pg/viewform",
    "https://cauldron.pretoriaresearchlab.io/baklava-faucet"
  ],
  "infoURL": "https://docs.celo.org/",
  "name": "Celo Baklava Testnet",
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "networkId": 62320,
  "rpc": [
    "https://celo-baklava-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://62320.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://baklava-forno.celo-testnet.org"
  ],
  "shortName": "BKLV",
  "slip44": 1,
  "slug": "celo-baklava-testnet",
  "testnet": true
} as const satisfies Chain;