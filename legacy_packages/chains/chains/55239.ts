import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 55239,
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
  "name": "Borne",
  "nativeCurrency": {
    "name": "Borne Token",
    "symbol": "BORNE",
    "decimals": 18
  },
  "networkId": 55239,
  "redFlags": [],
  "rpc": [
    "https://55239.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-bornefdn-w00dd.avax-test.network/ext/bc/28ACsxrnCZoTyUGTgrHxeht4WugDsW9jwdADNFDSBZivaVMxS6/rpc?token=6228963b69d441e8881b5db9611f41e1aec0c0bb0b4b979a7dc6926d2743c18c"
  ],
  "shortName": "Borne",
  "slug": "borne",
  "testnet": true
} as const satisfies Chain;