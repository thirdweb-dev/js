export default {
  "name": "Mixin Virtual Machine",
  "chain": "MVM",
  "rpc": [
    "https://mixin-virtual-machine.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://geth.mvm.dev"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://mvm.dev",
  "shortName": "mvm",
  "chainId": 73927,
  "networkId": 73927,
  "icon": {
    "url": "ipfs://QmeuDgSprukzfV7fi9XYHYcfmT4aZZZU7idgShtRS8Vf6V",
    "width": 471,
    "height": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "mvmscan",
      "url": "https://scan.mvm.dev",
      "icon": "mvm",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "mixin-virtual-machine"
} as const;