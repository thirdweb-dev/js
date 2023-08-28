import type { Chain } from "../src/types";
export default {
  "name": "Mind Smart Chain Testnet",
  "chain": "tMIND",
  "icon": {
    "url": "ipfs://QmX2b4CzNyrNgy4ERBEteSS9MsuYNVYeq2sSMMiogGjbFP",
    "width": 732,
    "height": 732,
    "format": "jpg"
  },
  "rpc": [
    "https://mind-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-msc.mindchain.info/",
    "wss://testnet-msc.mindchain.info/ws"
  ],
  "faucets": [
    "https://faucet.mindchain.info/"
  ],
  "nativeCurrency": {
    "name": "MIND Coin",
    "symbol": "tMIND",
    "decimals": 18
  },
  "infoURL": "https://mindscan.info",
  "shortName": "tMIND",
  "chainId": 9977,
  "networkId": 9977,
  "explorers": [
    {
      "name": "Mind Chain explorer",
      "url": "https://testnet.mindscan.info",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "mind-smart-chain-testnet"
} as const satisfies Chain;