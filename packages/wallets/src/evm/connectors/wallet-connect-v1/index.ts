import { Connector, getClient, ProviderRpcError } from '@wagmi/core'
import {
    SwitchChainError,
    UserRejectedRequestError,
    normalizeChainId,
} from '@wagmi/core'
import type { Chain } from '@wagmi/core/chains'
import type WalletConnectProvider from '@walletconnect/legacy-provider'
import { providers } from 'ethers'
import { getAddress, hexValue } from 'ethers/lib/utils.js'

/**
 * Wallets that support chain switching through WalletConnect
 * - imToken (token.im)
 * - MetaMask (metamask.io)
 * - Rainbow (rainbow.me)
 * - Trust Wallet (trustwallet.com)
 */
const switchChainAllowedRegex = /(imtoken|metamask|rainbow|trust wallet)/i;

type WalletConnectOptions = ConstructorParameters<
    typeof WalletConnectProvider
>[0];

type WalletConnectSigner = providers.JsonRpcSigner;

export class WalletConnectV1Connector extends Connector<
    WalletConnectProvider,
    WalletConnectOptions,
    WalletConnectSigner
> {
    readonly id = "walletConnectV1";
    readonly name = "WalletConnectV1";
    readonly ready = true;

    #provider?: WalletConnectProvider;

    constructor(config: { chains?: Chain[]; options: WalletConnectOptions }) {
        super(config);
    }

    async connect({ chainId }: { chainId?: number } = {}) {
        try {
            let targetChainId = chainId;
            if (!targetChainId) {
                console.log('get client on autoconnect')
                const lastUsedChainId = getClient().lastUsedChainId;
                if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) {
                    targetChainId = lastUsedChainId;
                }
            }

            console.log('wcv1Connector.gettingclient')
            const provider = await this.getProvider({
                chainId: targetChainId,
                create: true,
            });
            console.log('wcv1Connector after getProvider');
            provider.on('accountsChanged', this.onAccountsChanged);
            provider.on('chainChanged', this.onChainChanged);
            provider.on('disconnect', this.onDisconnect);
            provider.on('message', this.onMessage);
            provider.connector.on('display_uri', this.onDisplayUri);

            // Defer message to the next tick to ensure wallet connect data (provided by `.enable()`) is available
            setTimeout(() => this.emit('message', { type: 'connecting' }), 0);

            const accounts = await provider.enable();
            console.log('wcv1Connector after enable', JSON.stringify(accounts))
            const account = getAddress(accounts[0] as string);
            const id = await this.getChainId();
            const unsupported = this.isChainUnsupported(id);

            // Not all WalletConnect options support programmatic chain switching
            // Only enable for wallet options that do
            const walletName = provider.connector?.peerMeta?.name ?? '';
            if (switchChainAllowedRegex.test(walletName)) {
                this.switchChain = this.#switchChain;
            }

            return {
                account,
                chain: { id, unsupported },
                provider: new providers.Web3Provider(
                    provider as providers.ExternalProvider,
                ),
            }
        } catch (error) {
            if (/user closed modal/i.test((error as ProviderRpcError).message)) {
                throw new UserRejectedRequestError(error)
            }
            throw error
        }
    }

    async disconnect() {
        const provider = await this.getProvider()
        await provider.disconnect()

        provider.removeListener('accountsChanged', this.onAccountsChanged);
        provider.removeListener('chainChanged', this.onChainChanged);
        provider.removeListener('disconnect', this.onDisconnect);
        provider.removeListener('message', this.onMessage);

        // typeof localStorage !== 'undefined' &&
        //     localStorage.removeItem('walletconnect')
    }

    async getAccount() {
        const provider = await this.getProvider();
        const accounts = provider.accounts;
        // return checksum address
        return getAddress(accounts[0] as string);
    }

    async getChainId() {
        const provider = await this.getProvider()
        const chainId = normalizeChainId(provider.chainId)
        return chainId
    }

    async getProvider({
        chainId,
        create,
    }: { chainId?: number; create?: boolean } = {}) {
        // Force create new provider
        console.log('wcv1Connector.getProvider.inside', JSON.stringify(this.#provider?.accounts))
        if (!this.#provider || chainId || create) {
            const rpc = !this.options?.infuraId
                ? this.chains.reduce(
                    (rpc_, chain) => ({
                        ...rpc_,
                        [chain.id]: chain.rpcUrls.default.http[0],
                    }),
                    {},
                )
                : {}

            console.log('wcv1Connector.createing wcV1Provider. legacy-provider')
            const WalletConnectProvider = (
                await import('@walletconnect/legacy-provider')
            ).default
            console.log('setLocalProvider')
            this.#provider = new WalletConnectProvider({
                ...this.options,
                chainId,
                rpc: { ...rpc, ...this.options?.rpc },
                // sessionStorage: new SessionStorage(opts.connectorOpts.storageId);
            })
            console.log('wcv1Connector.created wcV1Provider')
        }

        return this.#provider
    }

    async getSigner({ chainId }: { chainId?: number } = {}) {
        const [provider, account] = await Promise.all([
            this.getProvider({ chainId }),
            this.getAccount(),
        ])
        return new providers.Web3Provider(
            provider as providers.ExternalProvider,
            chainId,
        ).getSigner(account)
    }

    async isAuthorized() {
        try {
            const account = await this.getAccount()
            return !!account
        } catch {
            return false
        }
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
                        if (chain?.id === chainId) {
                            res(chainId)
                        }
                    }),
                ),
            ])
            return (
                this.chains.find((x) => x.id === chainId) ??
                ({
                    id: chainId,
                    name: `Chain ${id}`,
                    network: `${id}`,
                    nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
                    rpcUrls: { default: { http: [''] }, public: { http: [''] } },
                } as Chain)
            )
        } catch (error) {
            const message =
                typeof error === 'string' ? error : (error as ProviderRpcError)?.message
            if (/user rejected request/i.test(message)) {
                throw new UserRejectedRequestError(error)
            }
            throw new SwitchChainError(error)
        }
    }

    protected onDisplayUri = (error: any, payload: { params: string[] }) => {
        if (error) {
            this.emit('message', { data: error, type: 'display_uri_error' })
        }
        this.emit('message', { data: payload.params[0], type: 'display_uri' })
    }

    protected onMessage = (message: {
        type: string;
        data: unknown;
    }) => {
        this.emit('message', message);
    }

    protected onAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
            this.emit('disconnect')
        } else {
            this.emit('change', { account: getAddress(accounts[0] as string) })
        }
    }

    protected onChainChanged = (chainId: number | string) => {
        const id = normalizeChainId(chainId)
        const unsupported = this.isChainUnsupported(id)
        this.emit('change', { chain: { id, unsupported } })
    }

    protected onDisconnect = () => {
        console.log('wcv1Connector.onDisconnect')
        this.emit('disconnect')
    }
}