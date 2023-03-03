export default {
  "name": "Horizen Yuma Testnet",
  "shortName": "Yuma",
  "chain": "Yuma",
  "icon": {
    "url": "ipfs://QmSFMBk3rMyu45Sy9KQHjgArFj4HdywANNYrSosLMUdcti",
    "width": 1213,
    "height": 1213,
    "format": "png"
  },
  "rpc": [
    "https://horizen-yuma-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://yuma-testnet.horizenlabs.io/ethv1"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [
    "https://yuma-testnet-faucet.horizen.io"
  ],
  "nativeCurrency": {
    "name": "Testnet Zen",
    "symbol": "tZEN",
    "decimals": 18
  },
  "infoURL": "https://horizen.io/",
  "chainId": 1662,
  "networkId": 1662,
  "slip44": 121,
  "explorers": [
    {
      "name": "Yuma Testnet Block Explorer",
      "url": "https://yuma-explorer.horizen.io",
      "icon": "eon",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "horizen-yuma-testnet"
} as const;