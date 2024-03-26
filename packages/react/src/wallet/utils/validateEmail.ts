// A super basic email validation function that is very forgiving to allow for a wide range emails
export function validateEmail(str: string) {
  // <string> + @ + <string> + . + <string>
  const emailRegex = /^\S+@\S+\.\S+$/;

  return emailRegex.test(str.replace(/\+/g, ""));
}
