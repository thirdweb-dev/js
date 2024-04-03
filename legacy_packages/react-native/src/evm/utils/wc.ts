export const hasMethod = (obj: any, method: string): boolean => {
  return method in obj && typeof obj[method] === "function";
};
