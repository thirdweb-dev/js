import { NATIVE_TOKEN_ADDRESS } from "thirdweb";

type Tokens = Record<
  string,
  | {
      chainId: number;
      tokens: Record<string, string | undefined>;
    }
  | undefined
>;

const tokens: Tokens = {
  eth: {
    chainId: 1,
    tokens: {
      usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      shib: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    },
  },
  bnb: {
    chainId: 56,
    tokens: {
      ada: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47",
    },
  },
  avax: {
    chainId: 43114,
    tokens: {},
  },
  doge: {
    chainId: 2000,
    tokens: {},
  },
  base: {
    chainId: 8453,
    tokens: {
      usdc: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
      weth: "0x4200000000000000000000000000000000000006",
    },
  },
  pol: {
    chainId: 137,
    tokens: {
      usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      bnb: "0x3BA4c387f786bFEE076A58914F5Bd38d668B42c3",
      shib: "0x6f8a06447ff6fcf75d803135a7de15ce88c1d4ec",
      weth: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      avax: "0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b",
    },
  },
  arb: {
    chainId: 42161,
    tokens: {
      usdc: "0xaf88d065e77c8cc2239327c5edb3a432268e5831",
    },
  },
};

type TokenPairData = {
  from: {
    chainId: number;
    tokenAddress: string;
  };
  to: {
    chainId: number;
    tokenAddress: string;
  };
};

// examples: eth-to-eth-usdc, eth-usdc-to-pol, base-to-eth
export function getTokenPairData(slug: string): TokenPairData | undefined {
  const [fromSlug, toSlug] = slug.split("-to-");
  if (!fromSlug || !toSlug) {
    return undefined;
  }

  const fromTokenInfo = getTokenInfo(fromSlug);
  const toTokenInfo = getTokenInfo(toSlug);

  if (!fromTokenInfo || !toTokenInfo) {
    return undefined;
  }

  return {
    from: fromTokenInfo,
    to: toTokenInfo,
  };
}

function getTokenInfo(slug: string):
  | {
      chainId: number;
      tokenAddress: string;
    }
  | undefined {
  const [chainSlug, tokenSlug] = slug.split("-");

  if (!chainSlug) {
    return undefined;
  }

  const chainObject = tokens[chainSlug];

  if (!chainObject) {
    return undefined;
  }

  const tokenAddress = tokenSlug
    ? chainObject.tokens[tokenSlug]
    : NATIVE_TOKEN_ADDRESS;

  if (!tokenAddress) {
    return undefined;
  }

  return {
    chainId: chainObject.chainId,
    tokenAddress,
  };
}

export function generateTokenPairSlugs() {
  const tokenIds = Object.keys(tokens);

  // generate all possible token pair slugs
  const tokenSlugs: string[] = [];
  for (const chainSlug of tokenIds) {
    // erc20s and native token
    if (tokens[chainSlug]) {
      tokenSlugs.push(chainSlug); // native token
      for (const tokenSlug in tokens[chainSlug].tokens) {
        tokenSlugs.push(`${chainSlug}-${tokenSlug}`);
      }
    }
  }

  const routeSlugs: string[] = [];
  for (const fromSlug of tokenSlugs) {
    for (const toSlug of tokenSlugs) {
      if (fromSlug === toSlug) {
        continue;
      }
      routeSlugs.push(`${fromSlug}-to-${toSlug}`);
    }
  }

  return routeSlugs;
}
