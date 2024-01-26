// Next.js Pages Router support
// default and backward compatible
export { ThirdwebAuth } from './router-pages'
export type {
  ThirdwebAuthConfig,
  ThirdwebAuthContext,
} from './router-pages/types'

// Next.js App Router support
export { ThirdwebAuth as ThirdwebAuthAppRouter } from './router-app'
export type {
  ThirdwebAuthConfig as ThirdwebAuthAppRouterConfig,
  ThirdwebAuthContext as ThirdwebAuthAppRouterContext,
} from './router-app/types'

// common types
export type {
  ThirdwebAuthRoute,
  ThirdwebAuthUser,
  ThirdwebNextContext,
} from './common/types'
