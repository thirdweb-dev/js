import ora from "ora";

type LogLevel = "debug" | "info" | "warn" | "error";

type BasicLoggerConstructorParams = {
  minLevel?: LogLevel;
};

function shouldLog(minLevel: LogLevel, currentLevel: LogLevel): boolean {
  const levels = ["debug", "info", "warn", "error"];
  return levels.indexOf(currentLevel) >= levels.indexOf(minLevel);
}

class BasicLogger {
  #minLevel: LogLevel = "info";
  constructor(params?: BasicLoggerConstructorParams) {
    if (params?.minLevel) {
      this.#minLevel = params.minLevel;
    }
  }

  setSettings(params: BasicLoggerConstructorParams) {
    if (params.minLevel) {
      this.#minLevel = params.minLevel;
    }
  }

  debug(...args: any[]) {
    if (shouldLog(this.#minLevel, "debug")) {
      console.info(...args);
    }
  }

  info(...args: any[]) {
    if (shouldLog(this.#minLevel, "info")) {
      console.info(...args);
    }
  }

  warn(...args: any[]) {
    if (shouldLog(this.#minLevel, "warn")) {
      console.warn(...args);
    }
  }

  error(...args: any[]) {
    if (shouldLog(this.#minLevel, "error")) {
      console.error(...args);
    }
  }
}

// create a copy of console
export const logger = new BasicLogger();

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
