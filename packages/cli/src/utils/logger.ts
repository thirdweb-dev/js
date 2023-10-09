// initial version from: https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/src/logger.ts

import { format } from "node:util";
import chalk from "chalk";
import CLITable from "cli-table3";
import { formatMessagesSync } from "esbuild";

// assign the original "console" to a variable so we can use it later
const originalConsole = globalThis.console;
// overwrite the original console with noop functions
globalThis.console = {
  debug: () => {},
  log: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
} as any;

export const LOGGER_LEVELS = {
  none: -1,
  error: 0,
  warn: 1,
  info: 2,
  log: 3,
  debug: 4,
} as const;

export type LoggerLevel = keyof typeof LOGGER_LEVELS;

/** A map from LOGGER_LEVEL to the error `kind` needed by `formatMessagesSync()`. */
const LOGGER_LEVEL_FORMAT_TYPE_MAP = {
  error: "error",
  warn: "warning",
  info: undefined,
  log: undefined,
  debug: undefined,
} as const;

function getLoggerLevel(): LoggerLevel {
  return "log";
}

export type TableRow<Keys extends string> = Record<Keys, string>;

export class Logger {
  constructor() {}

  loggerLevel = getLoggerLevel();
  columns = process.stdout.columns;

  debug = (...args: unknown[]) => this.doLog("debug", args);
  info = (...args: unknown[]) => this.doLog("info", args);
  log = (...args: unknown[]) => this.doLog("log", args);
  warn = (...args: unknown[]) => this.doLog("warn", args);
  error = (...args: unknown[]) => this.doLog("error", args);
  table<Keys extends string>(data: TableRow<Keys>[]) {
    const keys: Keys[] =
      data.length === 0 ? [] : (Object.keys(data[0]) as Keys[]);
    const t = new CLITable({
      head: keys,
      style: {
        head: chalk.level ? ["blue"] : [],
        border: chalk.level ? ["gray"] : [],
      },
    });
    t.push(...data.map((row) => keys.map((k) => row[k])));
    return this.doLog("log", [t.toString()]);
  }

  private doLog(messageLevel: Exclude<LoggerLevel, "none">, args: unknown[]) {
    if (LOGGER_LEVELS[this.loggerLevel] >= LOGGER_LEVELS[messageLevel]) {
      originalConsole[messageLevel](
        this.formatMessage(messageLevel, format(...args)),
      );
    }
  }

  private formatMessage(
    level: Exclude<LoggerLevel, "none">,
    message: string,
  ): string {
    const kind = LOGGER_LEVEL_FORMAT_TYPE_MAP[level];
    if (kind) {
      // Format the message using the esbuild formatter.
      // The first line of the message is the main `text`,
      // subsequent lines are put into the `notes`.
      const [firstLine, ...otherLines] = message.split("\n");
      const notes =
        otherLines.length > 0
          ? otherLines.map((text) => ({ text }))
          : undefined;
      return formatMessagesSync([{ text: firstLine, notes }], {
        color: true,
        kind,
        terminalWidth: this.columns,
      })[0];
    } else {
      return message;
    }
  }
}

/**
 * A drop-in replacement for `console` for outputting logging messages.
 *
 * Errors and Warnings will get additional formatting to highlight them to the user.
 * You can also set a `logger.loggerLevel` value to one of "debug", "log", "warn" or "error",
 * to filter out logging messages.
 */
export const logger = new Logger();
