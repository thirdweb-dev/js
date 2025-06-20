// TODO: clean all of this up a heck of a lot!

const LOGIN_URL = "https://login.thirdweb.com";
const CLIENT_ID = "demo";

export async function triggerLogin() {
  const { codeChallenge, codeVerifier } = await generateCodeChallenge();
  const state = generateState();
  storeCodeVerifier(codeVerifier);
  storeState(state);
  const redirectUri = window.location.href;
  window.location.href = `${LOGIN_URL}/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
}

// do code exchange
export async function handleLogin(code: string) {
  const codeVerifier = getCodeVerifier();
  const state = getState();
  if (!codeVerifier || !state) {
    console.error("No code verifier or state found");
    return;
  }
  // clear the code verifier and state -> we don't need them anymore
  clearCodeVerifier();
  clearState();
  const redirectUri = window.location.href;

  fetch(`${LOGIN_URL}/api/token`, {
    body: JSON.stringify({
      client_id: CLIENT_ID,
      code,
      code_verifier: codeVerifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      state,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
    })
    .catch((err) => {
      console.error("error", err);
    });
}

// oauth2 PKCE code challenge generator (code challenge has to be url safe)
async function generateCodeChallenge() {
  const codeVerifier = base64UrlEncode(
    window.crypto.getRandomValues(new Uint8Array(64)),
  );
  const codeChallenge = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier),
  );
  return {
    codeChallenge: base64UrlEncode(codeChallenge),
    codeVerifier: codeVerifier,
  };
}

function generateState() {
  const random = window.crypto.getRandomValues(new Uint8Array(12));
  return base64UrlEncode(random);
}

function base64UrlEncode(array: Uint8Array | ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(array)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function storeCodeVerifier(codeVerifier: string) {
  localStorage.setItem("codeVerifier", codeVerifier);
}
function getCodeVerifier() {
  return localStorage.getItem("codeVerifier");
}
function clearCodeVerifier() {
  localStorage.removeItem("codeVerifier");
}
function storeState(state: string) {
  localStorage.setItem("state", state);
}
function getState() {
  return localStorage.getItem("state");
}
function clearState() {
  localStorage.removeItem("state");
}
