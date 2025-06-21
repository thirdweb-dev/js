import { describe, expect, it } from "vitest";
import type { LocaleId } from "../../../../../react/web/ui/types.js";
import br from "./br.js";
import de from "./de.js";
import en from "./en.js";
import es from "./es.js";
import fr from "./fr.js";
import { getInjectedWalletLocale } from "./getInjectedWalletLocale.js";
import ja from "./ja.js";
import kr from "./kr.js";
import ru from "./ru.js";
import tl from "./tl.js";
import vi from "./vi.js";

const locales: { locale: LocaleId; content: object }[] = [
  { content: es, locale: "es_ES" },
  { content: ja, locale: "ja_JP" },
  { content: tl, locale: "tl_PH" },
  { content: vi, locale: "vi_VN" },
  { content: de, locale: "de_DE" },
  { content: kr, locale: "ko_KR" },
  { content: fr, locale: "fr_FR" },
  { content: ru, locale: "ru_RU" },
  { content: br, locale: "pt_BR" },
];

describe("getInjectedWalletLocale", () => {
  for (const item of locales) {
    it(`should return the correct locale structure for ${item.locale}`, async () => {
      expect(await getInjectedWalletLocale(item.locale)).toStrictEqual(
        item.content,
      );
    });
  }

  it("should return the default locale being ENGLISH for an unsupported locale", async () => {
    expect(
      await getInjectedWalletLocale("unsupported_locale" as LocaleId),
    ).toBe(en);
  });
});
