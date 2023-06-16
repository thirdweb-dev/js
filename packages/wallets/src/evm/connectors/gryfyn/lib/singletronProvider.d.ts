import { GryFynProvider } from './gryfynProvider';
import { GryFynProviderWeb } from './gryfynProviderWeb';
import { GryFynProviderPopup } from './gryfynProviderPopup';

export declare class GryFyn {
    static instance: GryFynProvider;
    static instancePopup: GryFynProviderPopup;
    static instanceB: GryFynProviderWeb;
    static getProvider(apiKey: string, option: any): GryFynProviderPopup;
    static getProviderOld(apiKey: string): GryFynProvider;
    static getProviderWeb(apiKey: string): GryFynProviderWeb;
}
export default GryFyn;
