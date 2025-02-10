import { keccak256 } from "thirdweb";

export function teamsCacheTag(authToken: string) {
  return `${shortenAuthToken(authToken)}/teams`;
}

export function projectsCacheTag(authToken: string) {
  return `${shortenAuthToken(authToken)}/projects`;
}

export function accountCacheTag(authToken: string) {
  return `${shortenAuthToken(authToken)}/account`;
}

function shortenAuthToken(authToken: string) {
  // authToken is too long for the next.js cache tag, we have to shorten it
  // shorten auth token by creating a hash of it
  const authTokenHash = keccak256(new TextEncoder().encode(authToken));
  return authTokenHash;
}
