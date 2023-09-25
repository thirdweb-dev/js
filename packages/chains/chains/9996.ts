import type { Chain } from "../src/types";
export default {
  "chainId": 9996,
  "chain": "MIND",
  "name": "Mind Smart Chain Mainnet",
  "rpc": [
    "https://mind-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-msc.mindchain.info/",
    "https://seednode.mindchain.info",
    "wss://seednode.mindchain.info/ws"
  ],
  "slug": "mind-smart-chain",
  "icon": {
    "url": "ipfs://QmX2b4CzNyrNgy4ERBEteSS9MsuYNVYeq2sSMMiogGjbFP",
    "width": 732,
    "height": 732,
    "format": "jpg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "MIND Coin",
    "symbol": "MIND",
    "decimals": 18
  },
  "infoURL": "https://mindchain.info",
  "shortName": "MIND",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mind Chain explorer",
      "url": "https://mainnet.mindscan.info",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;