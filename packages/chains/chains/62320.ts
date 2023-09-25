import type { Chain } from "../src/types";
export default {
  "chainId": 62320,
  "chain": "CELO",
  "name": "Celo Baklava Testnet",
  "rpc": [
    "https://celo-baklava-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://baklava-forno.celo-testnet.org"
  ],
  "slug": "celo-baklava-testnet",
  "faucets": [
    "https://docs.google.com/forms/d/e/1FAIpQLSdfr1BwUTYepVmmvfVUDRCwALejZ-TUva2YujNpvrEmPAX2pg/viewform",
    "https://cauldron.pretoriaresearchlab.io/baklava-faucet"
  ],
  "nativeCurrency": {
    "name": "CELO",
    "symbol": "CELO",
    "decimals": 18
  },
  "infoURL": "https://docs.celo.org/",
  "shortName": "BKLV",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;