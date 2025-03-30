import type { InjectedWalletLocale } from "./types.js";

/**
 * @internal
 */
const injectedWalletLocaleRu = (wallet: string): InjectedWalletLocale => ({
  connectionScreen: {
    inProgress: "Ожидание подтверждения",
    failed: "Подключение не удалось",
    instruction: `Примите запрос на подключение в ${wallet}`,
    retry: "Попробовать снова",
  },
  getStartedScreen: {
    instruction: `Отсканируйте QR-код, чтобы скачать приложение ${wallet}`,
  },
  scanScreen: {
    instruction: `Отсканируйте QR-код с помощью приложения ${wallet} для подключения`,
  },
  getStartedLink: `Нет ${wallet}?`,
  download: {
    chrome: "Скачать расширение для Chrome",
    android: "Скачать в Google Play",
    iOS: "Скачать в App Store",
  },
});

export default injectedWalletLocaleRu;
