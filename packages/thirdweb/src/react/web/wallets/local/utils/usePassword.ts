import { useState } from "react";

/**
 * Password form states
 * @internal
 */
export function usePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const passwordMismatch = confirmPassword
    ? password !== confirmPassword
    : false;

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    passwordMismatch,
    isWrongPassword,
    setIsWrongPassword,
  };
}
