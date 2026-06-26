import { ConsoleLogger, Injectable } from '@nestjs/common';
import { Logger as UseTermLogger } from 'use-term';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private useTermLogger = new UseTermLogger();

  log(message: any, context?: string) {
    this.useTermLogger.info(message, undefined, context || this.context);
  }

  error(message: any, stack?: string, context?: string) {
    this.useTermLogger.error(message, stack ? { stack } : undefined, context || this.context);
  }

  warn(message: any, context?: string) {
    this.useTermLogger.warn(message, undefined, context || this.context);
  }

  debug(message: any, context?: string) {
    this.useTermLogger.info(`[DEBUG] ${message}`, undefined, context || this.context);
  }

  verbose(message: any, context?: string) {
    this.useTermLogger.info(`[VERBOSE] ${message}`, undefined, context || this.context);
  }
}
