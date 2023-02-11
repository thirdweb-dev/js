export default {
  "name": "HyperonChain TestNet",
  "chain": "HPN",
  "icon": {
    "url": "ipfs://QmWxhyxXTEsWH98v7M3ck4ZL1qQoUaHG4HgtgxzD2KJQ5m",
    "width": 540,
    "height": 541,
    "format": "png"
  },
  "rpc": [
    "https://hyperonchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.hyperonchain.com"
  ],
  "faucets": [
    "https://faucet.hyperonchain.com"
  ],
  "nativeCurrency": {
    "name": "HyperonChain",
    "symbol": "HPN",
    "decimals": 18
  },
  "infoURL": "https://docs.hyperonchain.com",
  "shortName": "hpn",
  "chainId": 400,
  "networkId": 400,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.hyperonchain.com",
      "icon": "hyperonchain",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "hyperonchain-testnet"
} as const;