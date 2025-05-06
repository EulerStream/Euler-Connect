enum LogColour {
  DEBUG = '#7ed450',
  INFO = '#6ed76e',
  WARN = '#FFA500',
  ERROR = '#FF0000',
}

function overrideArgs(logColour: LogColour, ...args: any[]) {
  let prefix = '%c[Sign Agent]';

  if (typeof args[0] === "string") {
    args[0] = prefix + ' ' + args[0];
  } else {
    args.unshift(prefix);
  }

  // Insert the colour as arg 2
  args.splice(1, 0, `color: ${logColour}`);
  return args;
}

const Logger = {
  debug: (...args: any[]) => console.debug(...overrideArgs(LogColour.DEBUG, ...args)),
  info: (...args: any[]) => console.info(...overrideArgs(LogColour.INFO, ...args)),
  warn: (...args: any[]) => console.warn(...overrideArgs(LogColour.WARN, ...args)),
  error: (...args: any[]) => console.error(...overrideArgs(LogColour.ERROR, ...args)),
}

export default Logger;