import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 44044,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "QIM 240530 TEST INTEROP",
  "nativeCurrency": {
    "name": "QIM 240530 TEST INTEROP Token",
    "symbol": "WCC",
    "decimals": 18
  },
  "networkId": 44044,
  "redFlags": [],
  "rpc": [
    "https://44044.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/qim240530t/testnet/rpc"
  ],
  "shortName": "QIM 240530 TEST INTEROP",
  "slug": "qim-240530-test-interop",
  "testnet": true
} as const satisfies Chain;