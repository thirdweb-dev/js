/** Staging tenant id for Glyph Cross-App Connect. @internal */
export const STAGING_GLYPH_APP_ID = "clxt9p8e601al6tgmsyhu7j3t";
/** Production tenant id for Glyph Cross-App Connect. @internal */
export const GLYPH_APP_ID = "cly38x0w10ac945q9yg9sm71i";
/** Icon used in connectors & UIs. @internal */
export const GLYPH_ICON_URL = "https://i.ibb.co/TxcwPQyr/Group-12489-1.png";

export const glyphConnectorDetails = {
  id: "io.useglyph.privy",
  name: "Glyph",
  iconUrl: GLYPH_ICON_URL,
  iconBackground: "#ffffff",
  shortName: "Glyph",
  type: "injected",
} as const;
