/**
 * NAAG NOOL UP — Secure Application Logger
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  info(message: string, meta?: unknown) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: unknown) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: unknown) {
    this.log('error', message, error);
  }

  debug(message: string, meta?: unknown) {
    if (this.isDev) {
      this.log('debug', message, meta);
    }
  }

  private log(level: LogLevel, message: string, meta?: unknown) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (level === 'error') {
      console.error(formatted, meta ?? '');
    } else if (level === 'warn') {
      console.warn(formatted, meta ?? '');
    } else {
      console.log(formatted, meta ?? '');
    }
  }
}

export const logger = new Logger();
