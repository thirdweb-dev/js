import type { Chain } from "../src/types";
export default {
  "chain": "Jumbo",
  "chainId": 234,
  "explorers": [
    {
      "name": "ProtoJumbo",
      "url": "https://protojumbo.jumbochain.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://protojumbo.jumbochain.org/faucet-smart"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://jumbochain.org",
  "name": "ProtoJumbo Testnet",
  "nativeCurrency": {
    "name": "JNFTC",
    "symbol": "JNFTC",
    "decimals": 18
  },
  "networkId": 234,
  "rpc": [
    "https://234.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnode.jumbochain.org"
  ],
  "shortName": "ProtoJumbo",
  "slip44": 1,
  "slug": "protojumbo-testnet",
  "testnet": true
} as const satisfies Chain;