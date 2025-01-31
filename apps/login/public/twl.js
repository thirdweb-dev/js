// biome-ignore lint/complexity/useArrowFunction: This is a self-executing function, we do not want to use an arrow function here.
(function () {
  const globalSetup = getSetup();

  const JWT_KEY = "tw.login:jwt";
  const CODE_KEY = "tw.login:code";

  // check if redirected first, this sets up the logged in state if it was from redirect
  const result = parseURL(new URL(window.location));
  if (
    result &&
    result.length === 2 &&
    result[1] === localStorage.getItem(CODE_KEY)
  ) {
    // reset the URL
    window.location.hash = "";
    window.location.search = "";

    // write the jwt to local storage
    localStorage.setItem(JWT_KEY, result[0]);
  }

  // always reset the code
  localStorage.removeItem(CODE_KEY);

  const jwt = localStorage.getItem(JWT_KEY);

  if (jwt) {
    // handle logged in state
    handleIsLoggedIn();
  } else {
    // handle not logged in state
    handleNotLoggedIn();
  }

  function handleIsLoggedIn() {
    window.thirdweb = {
      isLoggedIn: true,
      getUser: async () => {
        const res = await fetch(`${globalSetup.baseUrl}/api/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(JWT_KEY)}`,
          },
        });
        return res.json();
      },
      logout: () => {
        window.localStorage.removeItem(JWT_KEY);
        window.location.reload();
      },
    };

    renderFloatingBubble(true);
  }

  function handleNotLoggedIn() {
    window.thirdweb = { login: onLogin, isLoggedIn: false };
    renderFloatingBubble(false);
  }

  function onLogin() {
    const code = window.crypto.getRandomValues(new Uint8Array(16)).join("");
    localStorage.setItem(CODE_KEY, code);
    // redirect to the login page
    const redirect = new URL(globalSetup.baseUrl);
    redirect.searchParams.set("code", code);
    redirect.searchParams.set("clientId", globalSetup.clientId);
    redirect.searchParams.set(
      "redirect",
      window.location.origin + window.location.pathname,
    );
    window.location.href = redirect.href;
  }

  // utils
  function getSetup() {
    const el = document.currentScript;
    if (!el) {
      throw new Error("Could not find script element");
    }
    const baseUrl = new URL(el.src).origin;
    const dataset = el.dataset;
    const clientId = dataset.clientId;
    const theme = dataset.theme || "dark";
    if (!clientId) {
      throw new Error("Missing client-id");
    }
    return { clientId, baseUrl, theme };
  }

  /**
   * @param {URL} url
   * @returns null | [string, string]
   */
  function parseURL(url) {
    try {
      const hash = url.hash.startsWith("#") ? url.hash.slice(1) : url.hash;
      const code = url.searchParams.get("code");
      if (!hash || !code) {
        return null;
      }
      return [hash, code];
    } catch {
      // if this fails, invalid data -> return null
      return null;
    }
  }

  async function renderFloatingBubble(loggedIn) {
    const el = document.createElement("div");
    el.id = "tw-floating-bubble";
    el.style.position = "fixed";
    el.style.bottom = "24px";
    el.style.right = "24px";
    el.style.zIndex = "1000";
    el.style.width = "138px";
    el.style.height = "40px";
    el.style.backgroundColor =
      globalSetup.theme === "dark" ? "#131418" : "#ffffff";
    el.style.color = globalSetup.theme === "dark" ? "white" : "black";
    el.style.borderRadius = "8px";
    el.style.placeItems = "center";
    el.style.fontSize = loggedIn ? "12px" : "12px";
    el.style.cursor = "pointer";
    el.style.overflow = "hidden";
    el.style.boxShadow = "1px 1px 10px rgba(0, 0, 0, 0.5)";
    el.style.display = "flex";
    el.style.alignItems = "center";
    el.style.justifyContent = "space-around";
    el.style.fontFamily = "sans-serif";
    el.style.gap = "8px";
    el.style.padding = "0px 8px";
    el.onclick = () => {
      if (loggedIn) {
        window.thirdweb.logout();
      } else {
        window.thirdweb.login();
      }
    };
    el.innerHTML = loggedIn ? await renderBlobbie() : renderThirdwebLogo();
    document.body.appendChild(el);
  }

  function renderThirdwebLogo() {
    const el = document.createElement("img");
    el.src = `${globalSetup.baseUrl}/logo.svg`;
    el.style.height = "16px";
    el.style.objectFit = "contain";
    el.style.flexShrink = "0";
    el.style.marginLeft = "-4px";
    return `${el.outerHTML} <span>Login</span><span></span>`;
  }

  async function renderBlobbie() {
    const address = (await window.thirdweb.getUser()).address;

    function hexToNumber(hex) {
      if (typeof hex !== "string")
        throw new Error(`hex string expected, got ${typeof hex}`);
      return hex === "" ? _0n : BigInt(`0x${hex}`);
    }

    const COLOR_OPTIONS = [
      ["#fca5a5", "#b91c1c"],
      ["#fdba74", "#c2410c"],
      ["#fcd34d", "#b45309"],
      ["#fde047", "#a16207"],
      ["#a3e635", "#4d7c0f"],
      ["#86efac", "#15803d"],
      ["#67e8f9", "#0e7490"],
      ["#7dd3fc", "#0369a1"],
      ["#93c5fd", "#1d4ed8"],
      ["#a5b4fc", "#4338ca"],
      ["#c4b5fd", "#6d28d9"],
      ["#d8b4fe", "#7e22ce"],
      ["#f0abfc", "#a21caf"],
      ["#f9a8d4", "#be185d"],
      ["#fda4af", "#be123c"],
    ];
    const colors =
      COLOR_OPTIONS[
        Number(hexToNumber(address.slice(2, 4))) % COLOR_OPTIONS.length
      ];
    const el = document.createElement("div");
    el.style.backgroundImage = `radial-gradient(ellipse at left bottom, ${colors[0]}, ${colors[1]})`;
    el.style.width = "24px";
    el.style.height = "24px";
    el.style.borderRadius = "50%";
    el.style.flexShrink = "0";

    return `${el.outerHTML}<span>${address.slice(0, 6)}...${address.slice(-4)}</span><span></span>`;
  }
})();
