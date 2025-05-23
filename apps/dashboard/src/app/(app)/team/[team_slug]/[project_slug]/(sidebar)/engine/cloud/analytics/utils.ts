export function storeUserAccessToken(projectId: string, accessToken: string) {
  localStorage.setItem(
    `thirdweb:engine-cloud-user-access-token-${projectId}`,
    accessToken,
  );
}

export function getUserAccessToken(projectId: string) {
  return localStorage.getItem(
    `thirdweb:engine-cloud-user-access-token-${projectId}`,
  );
}

export function deleteUserAccessToken(projectId: string) {
  localStorage.removeItem(
    `thirdweb:engine-cloud-user-access-token-${projectId}`,
  );
}
