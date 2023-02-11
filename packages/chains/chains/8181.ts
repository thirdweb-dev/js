export default {
  "name": "BeOne Chain Testnet",
  "chain": "BOC",
  "rpc": [
    "https://beone-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pre-boc1.beonechain.com",
    "https://pre-boc2.beonechain.com",
    "https://pre-boc3.beonechain.com"
  ],
  "faucets": [
    "https://testnet.beonescan.com/faucet"
  ],
  "nativeCurrency": {
    "name": "BeOne Chain Testnet",
    "symbol": "BOC",
    "decimals": 18
  },
  "infoURL": "https://testnet.beonescan.com",
  "shortName": "tBOC",
  "chainId": 8181,
  "networkId": 8181,
  "icon": {
    "url": "ipfs://QmbVLQnaMDu86bPyKgCvTGhFBeYwjr15hQnrCcsp1EkAGL",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "explorers": [
    {
      "name": "BeOne Chain Testnet",
      "url": "https://testnet.beonescan.com",
      "icon": "beonechain",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "beone-chain-testnet"
} as const;