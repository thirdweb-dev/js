export default {
  "name": "KLYNTAR",
  "chain": "KLY",
  "rpc": [
    "https://klyntar.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm.klyntar.org/kly_evm_rpc",
    "https://evm.klyntarscan.org/kly_evm_rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KLYNTAR",
    "symbol": "KLY",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://klyntar.org",
  "shortName": "kly",
  "chainId": 7331,
  "networkId": 7331,
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    "height": 512,
    "width": 512,
    "format": "png",
    "sizes": [
      512,
      256,
      128,
      64,
      32,
      16
    ]
  },
  "explorers": [],
  "status": "incubating",
  "testnet": false,
  "slug": "klyntar"
} as const;