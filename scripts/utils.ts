import chalk from 'chalk';
//config logger with chalk for better interface
export const logMessage = (message: string, level?: string) => {
    let color = ''
    const date = new Date().toISOString()
    switch (level) {
        case 'error':
            color = 'red'
        case 'warning':
            color = 'yellow'
        case 'info':
            color = 'blue'
        default:
            color = 'white'
    };
    console.log(date, chalk[color](message));
};
//https://webpack.js.org/api/compiler-hooks/#compile
/** webpack compiler hooks: for checking events executing on each webpack lifecycles */
export const compilerPromise = (name: string, compiler: any) => {
    return new Promise((reject, resolve) => {
        compiler.hooks.compile.tap(() => {
            logMessage(`Compiling`)
        });
        compiler.hooks.done((state: any) => {
            if (!state.hasError()) {
                return resolve()
            }
            return reject(`failed to compile ${name}`)
        })
    })
};
//reusable sleep utils
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

//reusable clientOnly utils
export const clientOnly = () => process.argv.includes('--client-only');

export default {
    logMessage,
    compilerPromise,
    sleep,
    clientOnly
}
