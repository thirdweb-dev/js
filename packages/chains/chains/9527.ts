export default {
  "name": "Rangers Protocol Testnet Robin",
  "chain": "Rangers",
  "icon": {
    "url": "ipfs://QmfHG3xbg4iiopagww93Gu7tmvCpPwZdiwsUjd3Dt5mRwT",
    "width": 835,
    "height": 835,
    "format": "png"
  },
  "rpc": [
    "https://rangers-protocol-testnet-robin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://robin.rangersprotocol.com/api/jsonrpc"
  ],
  "faucets": [
    "https://robin-faucet.rangersprotocol.com"
  ],
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "tRPG",
    "decimals": 18
  },
  "infoURL": "https://rangersprotocol.com",
  "shortName": "trpg",
  "chainId": 9527,
  "networkId": 9527,
  "explorers": [
    {
      "name": "rangersscan-robin",
      "url": "https://robin-rangersscan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "rangers-protocol-testnet-robin"
} as const;