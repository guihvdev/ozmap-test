type LogLevel = 'debug' | 'log' | 'warn' | 'error'

export class LoggerService {
  private logLevels: LogLevel[] = ['debug', 'log', 'warn', 'error']

  setLogLevels(levels: LogLevel[]) {
    this.logLevels = levels
  }

  log(message: any, context: string) {
    if (this.shouldLog('log')) {
      console.log(`[${context}]`, 'LOG', message)
    }
  }

  error(message: any, context: string) {
    if (this.shouldLog('error')) {
      console.error(`[${context}]`, 'ERROR', message)
    }
  }

  warn(message: any, context: string) {
    if (this.shouldLog('warn')) {
      console.warn(`[${context}]`, 'WARN', message)
    }
  }

  debug(message: any, context?: string) {
    if (this.shouldLog('debug')) {
      console.debug(`[${context}]`, 'DEBUG', message)
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.logLevels.includes(level)
  }
}
