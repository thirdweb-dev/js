export default {
  "name": "Rangers Protocol Mainnet",
  "chain": "Rangers",
  "icon": {
    "url": "ipfs://QmfHG3xbg4iiopagww93Gu7tmvCpPwZdiwsUjd3Dt5mRwT",
    "width": 835,
    "height": 835,
    "format": "png"
  },
  "rpc": [
    "https://rangers-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "RPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "shortName": "rpg",
  "chainId": 2025,
  "networkId": 2025,
  "slip44": 1008,
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "rangers-protocol"
} as const;