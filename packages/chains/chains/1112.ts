import type { Chain } from "../src/types";
export default {
  "chain": "TWEMIX",
  "chainId": 1112,
  "explorers": [
    {
      "name": "WEMIX Testnet Microscope",
      "url": "https://microscope.test.wemix.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://wallet.test.wemix.com/faucet"
  ],
  "features": [],
  "infoURL": "https://wemix.com",
  "name": "WEMIX3.0 Testnet",
  "nativeCurrency": {
    "name": "TestnetWEMIX",
    "symbol": "tWEMIX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://wemix3-0-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.test.wemix.com",
    "wss://ws.test.wemix.com"
  ],
  "shortName": "twemix",
  "slug": "wemix3-0-testnet",
  "testnet": true
} as const satisfies Chain;