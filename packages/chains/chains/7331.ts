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
    "url": "ipfs://QmaDr9R6dKnZLsogRxojjq4dwXuXcudR8UeTZ8Nq553K4u",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "explorers": [],
  "status": "incubating",
  "testnet": false,
  "slug": "klyntar"
} as const;