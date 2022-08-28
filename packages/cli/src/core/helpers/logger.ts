import ora from "ora";
import { Logger } from "tslog";

export const logger = new Logger({
  minLevel: "info",
  displayFilePath: "hidden",
  displayFunctionName: false,
  displayLoggerName: false,
  displayDateTime: false,
  displayLogLevel: false,
});

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
