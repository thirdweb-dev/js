export default {
  "name": "WEMIX3.0 Testnet",
  "chain": "TWEMIX",
  "rpc": [
    "https://wemix3-0-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.test.wemix.com",
    "wss://ws.test.wemix.com"
  ],
  "faucets": [
    "https://wallet.test.wemix.com/faucet"
  ],
  "nativeCurrency": {
    "name": "TestnetWEMIX",
    "symbol": "tWEMIX",
    "decimals": 18
  },
  "infoURL": "https://wemix.com",
  "shortName": "twemix",
  "chainId": 1112,
  "networkId": 1112,
  "explorers": [
    {
      "name": "WEMIX Testnet Microscope",
      "url": "https://microscope.test.wemix.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "wemix3-0-testnet"
} as const;