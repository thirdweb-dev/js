import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleRu = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    failed: "Подключение не удалось",
    inProgress: "Ожидание подтверждения",
    instruction: `Примите запрос на подключение в ${wallet}`,
    retry: "Попробовать снова",
  },
  download: {
    android: "Скачать в Google Play",
    chrome: "Скачать расширение для Chrome",
    iOS: "Скачать в App Store",
  },
  getStartedLink: `Ещё нет ${wallet}?`,
  getStartedScreen: {
    instruction: `Отсканируйте QR-код, чтобы скачать приложение ${wallet}`,
  },
  scanScreen: {
    instruction: `Для подключения отсканируйте QR-код с помощью приложения ${wallet}`,
  },
});

export default injectedWalletLocaleRu;
