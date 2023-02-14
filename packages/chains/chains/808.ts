export default {
  "name": "Portal Fantasy Chain Test",
  "chain": "PF",
  "icon": {
    "url": "ipfs://QmeMa6aw3ebUKJdGgbzDgcVtggzp7cQdfSrmzMYmnt5ywc",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "rpc": [
    "https://portal-fantasy-chain-test.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/portal-fantasy/testnet/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Portal Fantasy Token",
    "symbol": "PFT",
    "decimals": 18
  },
  "infoURL": "https://portalfantasy.io",
  "shortName": "PFTEST",
  "chainId": 808,
  "networkId": 808,
  "explorers": [],
  "testnet": true,
  "slug": "portal-fantasy-chain-test"
} as const;