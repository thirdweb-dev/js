import {CognitoUser} from 'amazon-cognito-identity-js';

// TODO: DO we need to swap this out with a proper state management system?
let cognitoUserAtom: CognitoUser | undefined;

export function getCognitoUser() {
  return cognitoUserAtom;
}

export function setCognitoUser(newUser: CognitoUser) {
  cognitoUserAtom = newUser;
}
