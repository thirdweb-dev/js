export default {
  "name": "Unicorn Ultra Testnet",
  "chain": "u2u",
  "rpc": [
    "https://unicorn-ultra-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.uniultra.xyz"
  ],
  "faucets": [
    "https://faucet.uniultra.xyz"
  ],
  "nativeCurrency": {
    "name": "Unicorn Ultra",
    "symbol": "U2U",
    "decimals": 18
  },
  "infoURL": "https://uniultra.xyz",
  "shortName": "u2u",
  "chainId": 39,
  "networkId": 39,
  "icon": {
    "url": "ipfs://QmcW64RgqQVHnNbVFyfaMNKt7dJvFqEbfEHZmeyeK8dpEa",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "icon": "u2u",
      "name": "U2U Explorer",
      "url": "https://testnet.uniultra.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "unicorn-ultra-testnet"
} as const;