import { describe, expect, it } from "vitest";
import type { LocaleId } from "../../../../../react/web/ui/types.js";
import br from "./br.js";
import de from "./de.js";
import en from "./en.js";
import es from "./es.js";
import fr from "./fr.js";
import { getSmartWalletLocale } from "./getSmartWalletLocale.js";
import ja from "./ja.js";
import kr from "./kr.js";
import ru from "./ru.js";
import tl from "./tl.js";
import vi from "./vi.js";

const locales: { locale: LocaleId; content: object }[] = [
  { locale: "es_ES", content: es },
  { locale: "ja_JP", content: ja },
  { locale: "tl_PH", content: tl },
  { locale: "vi_VN", content: vi },
  { locale: "de_DE", content: de },
  { locale: "ko_KR", content: kr },
  { locale: "fr_FR", content: fr },
  { locale: "ru_RU", content: ru },
  { locale: "pt_BR", content: br },
];

describe("getInjectedWalletLocale", () => {
  for (const item of locales) {
    it(`should return the correct locale structure for ${item.locale}`, async () => {
      expect(await getSmartWalletLocale(item.locale)).toStrictEqual(
        item.content,
      );
    });
  }

  it("should return the default locale being ENGLISH for an unsupported locale", async () => {
    expect(await getSmartWalletLocale("unsupported_locale" as LocaleId)).toBe(
      en,
    );
  });
});
