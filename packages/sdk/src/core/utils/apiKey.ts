let alreadyChecked = false;
export function checkClientIdOrSecretKey(clientId?: string, secretKey?: string) {
    if (alreadyChecked) {
        return;
    }
    alreadyChecked = true;

    if (clientId || secretKey) {
        return;
    }

    console.warn(
        "No clientId provided to <ThirdwebSDKProvider />. You will have limited access to thirdweb's services for storage, RPC, and account abstraction. You can get a client id from https://thirdweb.com/dashboard/"
    );
}