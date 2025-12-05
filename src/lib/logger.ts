/**
 * Advanced logging utility with levels and context
 * Provides structured logging for the app
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: Date;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;
  private minLevel: LogLevel = LogLevel.DEBUG;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private formatTimestamp(date: Date): string {
    return date.toISOString();
  }

  private createEntry(
    level: LogLevel,
    message: string,
    context?: string,
    data?: unknown
  ): LogEntry {
    return { level, message, context, data, timestamp: new Date() };
  }

  private output(entry: LogEntry): void {
    const { level, message, context, data, timestamp } = entry;
    const timeStr = this.formatTimestamp(timestamp);
    const contextStr = context ? `[${context}]` : '';
    const prefix = `${timeStr} ${contextStr}`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`${prefix} ℹ️`, message, data);
        break;
      case LogLevel.INFO:
        console.info(`${prefix} ℹ️`, message, data);
        break;
      case LogLevel.WARN:
        console.warn(`${prefix} ⚠️`, message, data);
        break;
      case LogLevel.ERROR:
        console.error(`${prefix} ❌`, message, data);
        break;
    }
  }

  private addLog(entry: LogEntry): void {
    if (entry.level < this.minLevel) return;

    this.logs.push(entry);

    // Keep logs under maxLogs by removing oldest
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.output(entry);
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.addLog(this.createEntry(LogLevel.DEBUG, message, context, data));
  }

  info(message: string, context?: string, data?: unknown): void {
    this.addLog(this.createEntry(LogLevel.INFO, message, context, data));
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.addLog(this.createEntry(LogLevel.WARN, message, context, data));
  }

  error(message: string, context?: string, error?: unknown): void {
    const data = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    this.addLog(this.createEntry(LogLevel.ERROR, message, context, data));
  }

  getLogs(level?: LogLevel, context?: string): LogEntry[] {
    return this.logs.filter((log) => {
      const levelMatch = level === undefined || log.level >= level;
      const contextMatch = context === undefined || log.context === context;
      return levelMatch && contextMatch;
    });
  }

  clearLogs(): void {
    this.logs = [];
  }

  setLevel(level: LogLevel): void {
    this.minLevel = level;
  }
}

// Export singleton instance
export const logger = new Logger(
  process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG
);

export default logger;
