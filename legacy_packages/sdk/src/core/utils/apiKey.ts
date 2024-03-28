let alreadyChecked = false;

/**
 * @internal
 */
export function checkClientIdOrSecretKey(
  message: string,
  clientId?: string,
  secretKey?: string,
) {
  if (alreadyChecked) {
    return;
  }
  alreadyChecked = true;

  if (clientId || secretKey) {
    return;
  }

  console.warn(message);
}
