import type { Chain } from "../src/types";
export default {
  "chainId": 9977,
  "chain": "tMIND",
  "name": "Mind Smart Chain Testnet",
  "rpc": [
    "https://mind-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-msc.mindchain.info/",
    "wss://testnet-msc.mindchain.info/ws"
  ],
  "slug": "mind-smart-chain-testnet",
  "icon": {
    "url": "ipfs://QmX2b4CzNyrNgy4ERBEteSS9MsuYNVYeq2sSMMiogGjbFP",
    "width": 732,
    "height": 732,
    "format": "jpg"
  },
  "faucets": [
    "https://faucet.mindchain.info/"
  ],
  "nativeCurrency": {
    "name": "MIND Coin",
    "symbol": "MIND",
    "decimals": 18
  },
  "infoURL": "https://mindchain.info",
  "shortName": "tMIND",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mind Chain explorer",
      "url": "https://testnet.mindscan.info",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;