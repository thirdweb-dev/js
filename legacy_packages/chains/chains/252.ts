import type { Chain } from "../src/types";
export default {
  "chain": "FRAX",
  "chainId": 252,
  "contracts": {
    "l1Contracts": {
      "L1StandardBridgeProxy": "0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2",
      "L2OutputOracleProxy": "0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4",
      "OptimismPortalProxy": "0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D"
    }
  },
  "explorers": [
    {
      "name": "fraxscan",
      "url": "https://fraxscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQLJk5G7zF8ZDxSxkRcpHqEqcifrJEhGmEKC6zwyPXWAw/fraxchain.png",
    "width": 512,
    "height": 512,
    "format": "PNG"
  },
  "infoURL": "https://mainnet.frax.com",
  "name": "Fraxtal",
  "nativeCurrency": {
    "name": "Frax Ether",
    "symbol": "frxETH",
    "decimals": 18
  },
  "networkId": 252,
  "redFlags": [],
  "rpc": [
    "https://252.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.frax.com"
  ],
  "shortName": "fraxtal",
  "slug": "fraxtal",
  "stackInfo": {
    "parentChainId": 1,
    "nativeTokenAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  },
  "stackType": "optimism_bedrock",
  "status": "active",
  "testnet": false
} as const satisfies Chain;