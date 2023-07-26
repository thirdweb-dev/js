let alreadyChecked = false;
export function checkClientIdOrSecretKey(message: string, clientId?: string, secretKey?: string, authToken?: string) {
    if (alreadyChecked) {
        return;
    }
    alreadyChecked = true;

    if (clientId || secretKey || authToken) {
        return;
    }

    console.warn(message);
}