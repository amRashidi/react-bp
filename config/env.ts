import fs from "fs";
import path from "path";
import paths from "./paths";
//remove cach from past build
delete require.cache[require.resolve('./paths')];

if (!process.env.NODE_ENV) {
    //TODO : no need for this scope
    throw new Error(
        'Missing variables: process.env.NODE_ENV'
    );
}

const dotenvFiles = [
    `${paths.dotenv}.${process.env.NODE_ENV}.local`,
    `${paths.dotenv}.${process.env.NODE_ENV}`,
    process.env.NODE_ENV !== 'test' && `${paths.dotenve}.local`,
    paths.dotenv,
].filter(Boolean);

dotenvFiles.forEach((dotenvFile: string) => {
    if (fs.existsSync(dotenvFile)) {
        require('dotenv').config({
            path: dotenvFile,
        })
    }
});

const appDirectory = fs.realpathSync(process.cwd());
//remap path
process.env.NODE_PATH = (process.env.NODe_PATH || '')
    .split(path.delimiter)
    .filter((folder: string) => folder && !path.isAbsolute(folder))
    .map((folder: string) => path.resolve(appDirectory, folder))
    .join(path.delimiter);

export default (): { stringified: any; raw: any } => {
    //define env vars for client side
    const raw = {
        PORT: process.env.PORT || 4000,
        NODE_ENV: process.env.NODE_ENV || 'development',
        HOST: process.env.HOST || 'http://localhost'
    };
    const stringified = {
        'process.env': Object.keys(raw).reduce((env, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env
        })
    }
    return { raw, stringified };
}
