import { Wallet } from "evm/types/wallet";

export const wallets: Record<string, Wallet> = {
  rainbow: {
    name: 'Rainbow',
    homepage: 'https://rainbow.me/',
    chains: ['eip155:1', 'eip155:10', 'eip155:137', 'eip155:42161'],
    versions: ['1'],
    sdks: ['sign_v1'],
    image_url: {
      sm: 'https://registry.walletconnect.org/v2/logo/sm/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500',
      md: 'https://registry.walletconnect.org/v2/logo/md/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500',
      lg: 'https://registry.walletconnect.org/v2/logo/lg/7a33d7f1-3d12-4b5c-f3ee-5cd83cb1b500',
    },
    mobile: {
      native: 'rainbow:',
      universal: 'https://rnbwapp.com',
    },
  },
  trustwallet: {
    name: 'Trust Wallet',
    homepage: 'https://trustwallet.com/',
    chains: ['cosmos:cosmoshub-4'],
    versions: ['1', '2'],
    sdks: ['sign_v1', 'sign_v2'],
    image_url: {
      sm: 'https://registry.walletconnect.org/v2/logo/sm/0528ee7e-16d1-4089-21e3-bbfb41933100',
      md: 'https://registry.walletconnect.org/v2/logo/md/0528ee7e-16d1-4089-21e3-bbfb41933100',
      lg: 'https://registry.walletconnect.org/v2/logo/lg/0528ee7e-16d1-4089-21e3-bbfb41933100',
    },
    mobile: {
      native: 'trust:',
      universal: 'https://link.trustwallet.com',
    },
  },
  metamask: {
    name: 'MetaMask',
    homepage: 'https://metamask.io/',
    chains: [],
    versions: ['1'],
    sdks: ['sign_v1'],
    image_url: {
      sm: 'https://registry.walletconnect.org/v2/logo/sm/5195e9db-94d8-4579-6f11-ef553be95100',
      md: 'https://registry.walletconnect.org/v2/logo/md/5195e9db-94d8-4579-6f11-ef553be95100',
      lg: 'https://registry.walletconnect.org/v2/logo/lg/5195e9db-94d8-4579-6f11-ef553be95100',
    },
    mobile: {
      native: 'metamask:',
      universal: 'https://metamask.app.link',
    },
  },
};
