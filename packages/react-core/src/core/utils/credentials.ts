type PasswordCredentials = {
  name: string;
  id: string;
  password: string;
  type: "password";
  iconURL: string;
};

export type UserCredentials = {
  name: string;
  password: string;
  id: string;
};

export const isCredentialsSupported = "PasswordCredential" in window;

// save credentials, so that repeated calls to getCredentials() does not prompt the user for account selection multiple times
let memoizedCred: UserCredentials;

export async function getCredentials(): Promise<UserCredentials | null> {
  if (!isCredentialsSupported) {
    return null;
  }

  if (memoizedCred) {
    return memoizedCred;
  }

  const cred = (await navigator.credentials.get({
    password: true,
    mediation: "optional", // don't show accout chooser if there's a single account
  } as CredentialRequestOptions)) as any as PasswordCredentials | null;

  if (!cred) {
    return null;
  }

  memoizedCred = cred;

  return {
    name: cred.name,
    password: cred.password,
    id: cred.id,
  };
}

export async function saveCredentials(credentials: UserCredentials) {
  if (!isCredentialsSupported) {
    throw new Error("Could not save credentials");
  }

  console.log("creating creds..");
  var cred = await navigator.credentials.create({
    password: credentials, // using password credential method
  } as CredentialCreationOptions);

  if (!cred) {
    throw new Error("Could not save credentials");
  }

  await navigator.credentials.store(cred);
}
