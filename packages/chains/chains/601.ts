import type { Chain } from "../src/types";
export default {
  "chainId": 601,
  "chain": "PEER",
  "name": "PEER Testnet",
  "rpc": [
    "https://peer-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet-polka-host-232813573.us-west-1.elb.amazonaws.com"
  ],
  "slug": "peer-testnet",
  "icon": {
    "url": "ipfs://QmPKKCdjEhP6CHekLD8YnhR2VsdjzprHapapDj7Wzqm52b",
    "width": 1363,
    "height": 760,
    "format": "png"
  },
  "faucets": [
    "https://testnet.peer.inc"
  ],
  "nativeCurrency": {
    "name": "PEER Token",
    "symbol": "PEER",
    "decimals": 18
  },
  "infoURL": "https://peer.inc",
  "shortName": "PEER",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "PEER Explorer",
      "url": "https://testnet.peer.inc",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;