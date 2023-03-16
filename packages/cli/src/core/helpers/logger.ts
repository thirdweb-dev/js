import ora from "ora";

// create a copy of console
export const logger = {
  // noop debug for now
  debug: () => {},
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

export function spinner(text: string) {
  return ora(`${text}\n`).start();
}

export function info(text: string) {
  return ora(text).succeed();
}

export function warn(text: string) {
  return ora(text).warn();
}

export function error(text: string) {
  return ora(text).fail();
}
