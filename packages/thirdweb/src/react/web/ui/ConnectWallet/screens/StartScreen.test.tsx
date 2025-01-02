import { describe, expect, it } from "vitest";
import { render } from "~test/react-render.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import en from "../locale/en.js";
import { StartScreen } from "./StartScreen.js";

const client = TEST_CLIENT;

describe("StartScreen", () => {
  it("should render an image for the welcome screen", () => {
    const { container } = render(
      <StartScreen
        connectLocale={en}
        client={client}
        welcomeScreen={{
          img: {
            src: "https://cat.png",
            width: 100,
            height: 100,
          },
        }}
        meta={{
          showThirdwebBranding: false,
          termsOfServiceUrl: "https://cat.com",
          privacyPolicyUrl: "https://privacy.com",
        }}
      />,
    );

    const img = container.querySelector("img");
    expect(img).not.toBe(null);
    expect(img?.src).toBe("https://cat.png/");
    expect(img?.width).toBe(100);
  });

  it("should render new-to-wallet link", () => {
    const { container } = render(
      <StartScreen
        connectLocale={en}
        client={client}
        welcomeScreen={undefined}
        meta={{
          showThirdwebBranding: false,
          termsOfServiceUrl: "https://cat.com",
          privacyPolicyUrl: "https://privacy.com",
        }}
      />,
    );

    const a = container.querySelector("a");
    expect(a).not.toBe(null);
    expect(a?.href).toBe("https://blog.thirdweb.com/web3-wallet/");
  });

  it("should render an svg icon if a custom image is not passed", () => {
    const { container } = render(
      <StartScreen
        connectLocale={en}
        client={client}
        welcomeScreen={undefined}
        meta={{
          showThirdwebBranding: false,
          termsOfServiceUrl: "https://cat.com",
          privacyPolicyUrl: "https://privacy.com",
        }}
      />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBe(null);
  });
});
