// @ts-check

const redirects = {
  "/unreal/:path*": "/unreal-engine/:path*",
  "/unreal-engine/cpp/wallet-handle": "/unreal-engine/cpp/wallet-handles",
  "/unreal-engine/blueprints/private-key-wallet":
    "unreal-engine/blueprints/in-app-wallet",
};

export { redirects as unrealEngineRedirects };
