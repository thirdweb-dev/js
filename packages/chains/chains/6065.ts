export default {
  "name": "Tres Testnet",
  "chain": "TresLeches",
  "rpc": [
    "https://tres-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test.tresleches.finance/"
  ],
  "faucets": [
    "http://faucet.tresleches.finance:8080"
  ],
  "nativeCurrency": {
    "name": "TRES",
    "symbol": "TRES",
    "decimals": 18
  },
  "infoURL": "https://treschain.com",
  "shortName": "TRESTEST",
  "chainId": 6065,
  "networkId": 6065,
  "icon": {
    "url": "ipfs://QmS33ypsZ1Hx5LMMACaJaxePy9QNYMwu4D12niobExLK74",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "treslechesexplorer",
      "url": "https://explorer-test.tresleches.finance",
      "icon": "treslechesexplorer",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "tres-testnet"
} as const;