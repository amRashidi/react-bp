import chalk from 'chalk';

export const logMessage = (message: string, level?: string) => {
  let color = ''
  const date = new Date().toISOString()
  switch (level) {
    case 'error':
      color = 'red'
      break
    case 'warning':
      color = 'yellow'
      break
    case 'info':
      color = 'blue'
      break
    default:
      color = 'white'
      break
  };
  console.log(date, chalk[color](message));
};
export const compilerPromise = (name: string, compiler: any) => {
  return new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      return logMessage(`[${name}] Compiling `,'info');
    });
    compiler.hooks.done.tap(name, (stats: any) => {
      if (!stats.hasErrors()) {
        return resolve(1);
      }
      return reject(`Failed to compile ${name}`);
    });
  });
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const clientOnly = () => process.argv.includes('--client-only');

export default {
  clientOnly,
  compilerPromise,
  logMessage,
  sleep,
};
