import {
  Chain,
  ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getClient,
  normalizeChainId,
  Connector,
} from '@wagmi/core'
import type WalletConnectProvider from '@walletconnect/ethereum-provider'
import type {
  UniversalProviderOpts,
  UniversalProvider as UniversalProvider_,
} from '@walletconnect/universal-provider'
import type { Web3Modal } from '@web3modal/standalone'
import { providers } from 'ethers'
import { getAddress, hexValue } from 'ethers/lib/utils.js'

// Shared config for WalletConnect v2
const defaultV2Config = {
  namespace: 'eip155',
  methods: [
    'eth_sendTransaction',
    'eth_sendRawTransaction',
    'eth_sign',
    'eth_signTransaction',
    'eth_signTypedData',
    'eth_signTypedData_v3',
    'eth_signTypedData_v4',
    'personal_sign',
    'wallet_switchEthereumChain',
    'wallet_addEthereumChain',
  ],
  events: ['accountsChanged', 'chainChanged'],
}

type UniversalProvider = InstanceType<typeof UniversalProvider_>

type WalletConnectOptions = {
  /** When `true`, uses default WalletConnect QR Code modal */
  qrcode?: boolean
  wallet: 'metamask' | 'trustwallet'
} & (
    | ({
      version?: '1'
    } & ConstructorParameters<typeof WalletConnectProvider>[0])
    | ({
      /**
       * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
       */
      projectId: NonNullable<UniversalProviderOpts['projectId']>
      version: '2'
    } & Omit<UniversalProviderOpts, 'projectId'>)
  )

type WalletConnectSigner = providers.JsonRpcSigner

export class WalletConnectConnector extends Connector<
  WalletConnectProvider | UniversalProvider,
  WalletConnectOptions,
  WalletConnectSigner
> {
  readonly id = 'walletConnect'
  readonly name = 'WalletConnect'
  readonly ready = true

  #provider?: WalletConnectProvider | UniversalProvider
  #initUniversalProviderPromise?: Promise<void>
  #web3Modal?: Web3Modal

  constructor(config: { chains?: Chain[]; options: WalletConnectOptions }) {
    super(config)
    if (this.version === '2') {
      this.#createUniversalProvider()
      if (this.isQrCode) this.#createWeb3Modal()
    }
  }

  get isQrCode() {
    return this.options.qrcode !== false
  }

  get namespacedChains() {
    return this.chains.map(
      (chain) => `${defaultV2Config.namespace}:${chain.id}`,
    )
  }

  get version() {
    if ('version' in this.options) return this.options.version
    return '1'
  }

  async connect({ chainId }: { chainId?: number } = {}) {
    const isV1 = this.version === '1'
    const isV2 = this.version === '2'

    try {
      let targetChainId = chainId
      if (!targetChainId) {
        const lastUsedChainId = getClient().lastUsedChainId
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId))
          targetChainId = lastUsedChainId
      }

      const provider = await this.getProvider({
        chainId: targetChainId,
        create: isV1,
      })
      provider.on('accountsChanged', this.onAccountsChanged)
      provider.on('chainChanged', this.onChainChanged)
      provider.on('disconnect', this.onDisconnect)

      if (isV2) {
        provider.on('session_delete', this.onDisconnect)
        provider.on('session_request_sent', this.onSessionRequestSent)
        provider.on('display_uri', this.onDisplayUri)

        const isChainsAuthorized = await this.#isChainsAuthorized()

        // If there is an active session, and the chains are not authorized,
        // disconnect the session.
        if ((provider as UniversalProvider).session && !isChainsAuthorized)
          await provider.disconnect()

        // If there is not an active session, or the chains are not authorized,
        // attempt to connect.
        if (
          !(provider as UniversalProvider).session ||
          ((provider as UniversalProvider).session && !isChainsAuthorized)
        ) {
          await Promise.race([
            provider.connect({
              namespaces: {
                [defaultV2Config.namespace]: {
                  methods: defaultV2Config.methods,
                  events: defaultV2Config.events,
                  chains: this.namespacedChains,
                  rpcMap: this.chains.reduce(
                    (rpc, chain) => ({
                      ...rpc,
                      [chain.id]: chain.rpcUrls.default.http[0],
                    }),
                    {},
                  ),
                },
              },
            }),
            ...(this.isQrCode
              ? [
                new Promise<void>((_resolve, reject) =>
                  provider.on('display_uri', async (uri: string) => {
                    await this.#web3Modal?.openModal({ uri })
                    // Modal is closed, reject promise so `catch` block for `connect` is called.
                    this.#web3Modal?.subscribeModal(({ open }) => {
                      if (!open) reject(new Error('user rejected'))
                    })
                  }),
                ),
              ]
              : []),
          ])

          // If execution reaches here, connection was successful and we can close modal.
          if (this.isQrCode) this.#web3Modal?.closeModal()
        }
      }

      // Defer message to the next tick to ensure wallet connect data (provided by `.enable()`) is available
      setTimeout(() => this.emit('message', { type: 'connecting' }), 0)

      const accounts = (await Promise.race([
        provider.enable(),
        // When using WalletConnect v1 QR Code Modal, handle user rejection request from wallet
        ...(isV1 && this.isQrCode
          ? [
            new Promise((_res, reject) =>
              (provider as WalletConnectProvider).connector.on(
                'disconnect',
                () => reject(new Error('user rejected')),
              ),
            ),
          ]
          : []),
      ])) as string[]
      const account = getAddress(accounts[0] as string)
      const id = await this.getChainId()
      const unsupported = this.isChainUnsupported(id)

      // Not all WalletConnect v1 options support programmatic chain switching.
      // Only enable for wallet options that do.
      if (isV1) {
        const walletName =
          (provider as WalletConnectProvider).connector?.peerMeta?.name ?? ''

        /**
         * Wallets that support chain switching through WalletConnect
         * - imToken (token.im)
         * - MetaMask (metamask.io)
         * - Omni (omni.app)
         * - Rainbow (rainbow.me)
         * - Trust Wallet (trustwallet.com)
         */
        const switchChainAllowedRegex =
          /(imtoken|metamask|omni|rainbow|trust wallet)/i
        if (switchChainAllowedRegex.test(walletName))
          this.switchChain = this.#switchChain
      }
      // In v2, chain switching is allowed programatically
      // as the user approves the chains when approving the pairing
      else this.switchChain = this.#switchChain

      return {
        account,
        chain: { id, unsupported },
        provider: new providers.Web3Provider(
          provider as providers.ExternalProvider,
        ),
      }
    } catch (error) {
      if (isV2 && this.isQrCode) this.#web3Modal?.closeModal()
      // WalletConnect v1: "user closed modal"
      // WalletConnect v2: "user rejected"
      if (
        /user closed modal|user rejected/i.test(
          (error as ProviderRpcError)?.message,
        )
      ) {
        throw new UserRejectedRequestError(error)
      }
      throw error
    }
  }

  async disconnect() {
    const provider = await this.getProvider()
    try {
      await provider.disconnect()
    } catch (error) {
      // If the session does not exist, we don't want to throw.
      if (!/No matching key/i.test((error as Error).message)) throw error
    }

    provider.removeListener('accountsChanged', this.onAccountsChanged)
    provider.removeListener('chainChanged', this.onChainChanged)
    provider.removeListener('disconnect', this.onDisconnect)

    if (this.version === '1' && typeof localStorage !== 'undefined')
      // Remove local storage session so user can connect again
      localStorage.removeItem('walletconnect')
    else {
      provider.removeListener('session_delete', this.onDisconnect)
      provider.removeListener('display_uri', this.onDisplayUri)
    }
  }

  async getAccount() {
    const provider = await this.getProvider()
    let accounts
    if (this.version === '1')
      accounts = (provider as WalletConnectProvider).accounts
    else
      accounts = (await provider.request({
        method: 'eth_accounts',
      })) as string[]

    // return checksum address
    return getAddress(accounts[0] as string)
  }

  async getChainId() {
    const provider = await this.getProvider()
    if (this.version === '1')
      return normalizeChainId((provider as WalletConnectProvider).chainId)

    // WalletConnect v2 does not internally manage chainIds anymore, so
    // we need to retrieve it from the client, or request it from the provider
    // if none exists.
    return (
      getClient().data?.chain?.id ??
      normalizeChainId(await provider.request({ method: 'eth_chainId' }))
    )
  }

  async getProvider({
    chainId,
    create,
  }: { chainId?: number; create?: boolean } = {}) {
    // WalletConnect v2
    if (this.options.version === '2') {
      if (!this.#provider) await this.#createUniversalProvider()

      if (chainId)
        (this.#provider as UniversalProvider).setDefaultChain(
          `${defaultV2Config.namespace}:${chainId}`,
        )

      return this.#provider as UniversalProvider
    }

    // WalletConnect v1 (Force create new provider)
    else if (!this.#provider || chainId || create) {
      const rpc = !this.options?.infuraId
        ? this.chains.reduce(
          (rpc, chain) => ({
            ...rpc,
            [chain.id]: chain.rpcUrls.default.http[0],
          }),
          {},
        )
        : {}
      const WalletConnectProvider = (
        await import('@walletconnect/ethereum-provider')
      ).default
      this.#provider = new WalletConnectProvider({
        ...this.options,
        chainId,
        rpc: { ...rpc, ...this.options?.rpc },
      })
      return this.#provider
    }

    return this.#provider
  }

  async getSigner({ chainId }: { chainId?: number } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
      this.getAccount(),
    ])

    let provider_ = provider as providers.ExternalProvider
    if (this.version === '2') {
      const chainId_ = await this.getChainId()
      provider_ = {
        ...provider,
        async request(args) {
          return await provider.request(
            args,
            `${defaultV2Config.namespace}:${chainId ?? chainId_}`,
          )
        },
      } as providers.ExternalProvider
    }

    return new providers.Web3Provider(provider_, chainId).getSigner(account)
  }

  async isAuthorized() {
    try {
      const [account, isChainsAuthorized] = await Promise.all([
        this.getAccount(),
        this.#isChainsAuthorized(),
      ])
      return !!account && isChainsAuthorized
    } catch {
      return false
    }
  }

  async #createWeb3Modal() {
    const { Web3Modal } = await import('@web3modal/standalone')
    const { version } = this.options
    this.#web3Modal = new Web3Modal({
      walletConnectVersion: version === '2' ? 2 : 1,
      projectId: version === '2' ? this.options.projectId : '',
      standaloneChains: this.namespacedChains,
    })
  }

  async #initUniversalProvider() {
    const WalletConnectProvider = (
      await import('@walletconnect/universal-provider')
    ).default
    if (typeof WalletConnectProvider?.init === 'function') {
      this.#provider = await WalletConnectProvider.init(
        this.options as UniversalProviderOpts,
      )
    }
  }

  async #createUniversalProvider() {
    if (!this.#initUniversalProviderPromise) {
      this.#initUniversalProviderPromise = this.#initUniversalProvider()
    }
    return this.#initUniversalProviderPromise
  }

  /**
   * @description Checks if the connector is authorized to access the requested chains.
   *
   * There could be a case where requested chains are out of sync with
   * the users' approved chains (e.g. the dapp could have added support
   * for an additional chain), hence the user will be unauthorized.
   */
  async #isChainsAuthorized() {
    const provider = await this.getProvider()

    if (this.version === '1') return true

    const providerChains =
      (provider as UniversalProvider).namespaces?.[defaultV2Config.namespace]
        ?.chains || []
    const authorizedChainIds = providerChains.map(
      (chain) => parseInt(chain.split(':')[1] || '') as Chain['id'],
    )
    return !this.chains.some(({ id }) => !authorizedChainIds.includes(id))
  }

  async #switchChain(chainId: number) {
    const provider = await this.getProvider()
    const id = hexValue(chainId)

    try {
      // Set up a race between `wallet_switchEthereumChain` & the `chainChanged` event
      // to ensure the chain has been switched. This is because there could be a case
      // where a wallet may not resolve the `wallet_switchEthereumChain` method, or
      // resolves slower than `chainChanged`.
      await Promise.race([
        provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: id }],
        }),
        new Promise((res) =>
          this.on('change', ({ chain }) => {
            if (chain?.id === chainId) res(chainId)
          }),
        ),
      ])
      if (this.version === '2') {
        ; (provider as UniversalProvider).setDefaultChain(
          `${defaultV2Config.namespace}:${chainId}`,
        )
        this.onChainChanged(chainId)
      }
      return (
        this.chains.find((x) => x.id === chainId) ?? {
          id: chainId,
          name: `Chain ${id}`,
          network: `${id}`,
          nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
          rpcUrls: { default: { http: [''] }, public: { http: [''] } },
        }
      )
    } catch (error) {
      const message =
        typeof error === 'string' ? error : (error as ProviderRpcError)?.message
      if (/user rejected request/i.test(message))
        throw new UserRejectedRequestError(error)
      throw new SwitchChainError(error)
    }
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect')
    else this.emit('change', { account: getAddress(accounts[0] as string) })
  }

  protected onSessionRequestSent = (payload) => {
    this.emit('message', { type: 'session_request_sent', data: payload })
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId)
    const unsupported = this.isChainUnsupported(id)
    this.emit('change', { chain: { id, unsupported } })
  }

  protected onDisconnect = () => {
    this.emit('disconnect')
  }

  protected onDisplayUri = (uri: string) => {
    this.emit('message', { type: 'display_uri', data: uri })
  }
}
