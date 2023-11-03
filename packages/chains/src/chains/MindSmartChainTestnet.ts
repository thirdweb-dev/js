import type { Chain } from "../types";
export default {
  "chain": "tMIND",
  "chainId": 9977,
  "explorers": [
    {
      "name": "Mind Chain explorer",
      "url": "https://testnet.mindscan.info",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.mindchain.info/"
  ],
  "icon": {
    "url": "ipfs://QmX2b4CzNyrNgy4ERBEteSS9MsuYNVYeq2sSMMiogGjbFP",
    "width": 732,
    "height": 732,
    "format": "jpg"
  },
  "infoURL": "https://mindchain.info",
  "name": "Mind Smart Chain Testnet",
  "nativeCurrency": {
    "name": "MIND Coin",
    "symbol": "tMIND",
    "decimals": 18
  },
  "networkId": 9977,
  "rpc": [
    "https://mind-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9977.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-msc.mindchain.info/",
    "wss://testnet-msc.mindchain.info/ws"
  ],
  "shortName": "tMIND",
  "slug": "mind-smart-chain-testnet",
  "testnet": true
} as const satisfies Chain;