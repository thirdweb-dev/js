import type { Chain } from "../src/types";
export default {
  "chain": "ETC",
  "chainId": 63,
  "explorers": [
    {
      "name": "blockscout-mordor",
      "url": "https://etc-mordor.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "etcnetworkinfo-expedition-mordor",
      "url": "https://explorer-expedition.etc-network.info/?network=Ethereum+Classic+at+etc-network.info+GETH+Mordor",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://easy.hebeswap.com/#/faucet",
    "https://faucet.mordortest.net"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://QmawMDPsaj3kBTZErCYQ3tshv5RrMAN3smWNs72m943Fyj",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://ethereumclassic.org/development/testnets",
  "name": "Mordor Testnet",
  "nativeCurrency": {
    "name": "Mordor Ether",
    "symbol": "METC",
    "decimals": 18
  },
  "networkId": 7,
  "rpc": [
    "https://mordor-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://63.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mordor.etccooperative.org",
    "https://geth-mordor.etc-network.info"
  ],
  "shortName": "metc",
  "slip44": 1,
  "slug": "mordor-testnet",
  "status": "active",
  "testnet": true,
  "title": "Ethereum Classic Mordor Testnet"
} as const satisfies Chain;