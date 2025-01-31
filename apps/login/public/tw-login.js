(() => {
  const { targetId, clientId, baseUrl } = getSetup();

  // the code to verify login was not tampered with
  let code = "";

  const USER_ADDRESS_KEY = "tw.login:userAddress";
  const SESSION_KEY_ADDRESS_KEY = "tw.login:sessionKeyAddress";

  function main() {
    // check if redirected first, this sets up the logged in state if it was from redirect
    const params = parseURLHash(new URL(window.location));
    console.log(params);
    // TECHNICALLY this should verify the code... but can't do that without backend of some sort
    if (params) {
      // reset the code
      code = "";
      // write the userAddress to local storage
      localStorage.setItem(USER_ADDRESS_KEY, params.userAddress);
      // write the sessionKeyAddress to local storage
      localStorage.setItem(SESSION_KEY_ADDRESS_KEY, params.sessionKeyAddress);
      // reset the URL hash
      window.location.hash = "";
    }

    const userAddress = localStorage.getItem(USER_ADDRESS_KEY);
    const sessionKeyAddress = localStorage.getItem(SESSION_KEY_ADDRESS_KEY);

    if (userAddress && sessionKeyAddress) {
      // handle logged in state
      handleIsLoggedIn();
    } else {
      // handle not logged in state
      handleNotLoggedIn();
    }
  }

  function handleIsLoggedIn() {
    console.log("handleIsLoggedIn");

    window.thirdweb = {
      isLoggedIn: true,
      getAddress: () => getAddress(),
      logout: () => {
        window.localStorage.removeItem(USER_ADDRESS_KEY);
        window.localStorage.removeItem(SESSION_KEY_ADDRESS_KEY);
        window.location.reload();
      },
      makeRequest: async () => {
        const res = await fetch(`${baseUrl}/api/request`, {
          method: "POST",
          body: JSON.stringify({
            userAddress: getAddress(),
            sessionKeyAddress: getSessionKeyAddress(),
          }),
        });
        const data = await res.json();
        console.log(data);
      },
    };
  }

  function handleNotLoggedIn() {
    window.thirdweb = { login: onLogin, isLoggedIn: false };
  }

  function onLogin() {
    code = window.crypto.getRandomValues(new Uint8Array(4)).join("");
    // redirect to the login page
    const redirect = new URL(baseUrl);
    redirect.searchParams.set("code", code);
    redirect.searchParams.set("clientId", clientId);
    redirect.searchParams.set("redirect", window.location.href);
    window.location.href = redirect.href;
  }

  function getAddress() {
    return localStorage.getItem(USER_ADDRESS_KEY);
  }

  function getSessionKeyAddress() {
    return localStorage.getItem(SESSION_KEY_ADDRESS_KEY);
  }

  // utils

  function getSetup() {
    const el = document.currentScript;
    if (!el) {
      throw new Error("Could not find script element");
    }
    const baseUrl = new URL(el.src).origin;
    const dataset = el.dataset;
    const targetId = dataset.target || "tw-login";
    const clientId = dataset.clientId;
    if (!clientId) {
      throw new Error("Missing client-id");
    }
    return { targetId, clientId, baseUrl };
  }

  /**
   * @param {URL} url
   * @returns null | { [key: string]: string }
   */
  function parseURLHash(url) {
    if (!url.hash) {
      return null;
    }
    try {
      return decodeHash(url.hash);
    } catch {
      // if this fails, invalid data -> return null
      return null;
    }
  }

  /**
   * Decodes a URL hash string to extract the three keys.
   *
   * @param {string} hash - A string like "#eyJrZXkxIjoiVmFsdWU..."
   * @returns {{ userAddress: string, sessionKeyAddress: string, code: string }} An object with the three keys
   */
  function decodeHash(hash) {
    // Remove the "#" prefix, if present.
    const base64Data = hash.startsWith("#") ? hash.slice(1) : hash;

    // Decode the Base64 string, then parse the JSON.
    const jsonString = atob(base64Data);
    const data = JSON.parse(jsonString);

    // data should have the shape { userAddress, sessionKeyAddress, code }.
    if (
      "userAddress" in data &&
      "sessionKeyAddress" in data &&
      "code" in data
    ) {
      return data;
    }
    return null;
  }

  main();
})();
