import getConfig from '../config/webpack';
import { choosePort } from 'react-dev-utils/WebpackDevServerUtils';
import paths from '../config/paths';
import { compilerPromise, logMessage, sleep } from './utils';
import rimraf from 'rimraf';
import webpack from 'webpack';


const webpackConfig = getConfig(process.env.NODE_ENV || 'development');

const HOST = process.env.HOST || 'http://localhost';

const generateStaicHTML = async () => {
  const nodemon = require('nodemon');
  const fs = require('fs');
  const puppeteer = require('puppeteer');
  const PORT = await choosePort('localhost', 8505);
  process.env.PORT = String(PORT);

  const script = nodemon({
    script: `${paths.serverBuild}/server.js`,
    ignore: ['*'],
  });

  script.on('start', async () => {
    try {
      //TODO: in next version we need to wait and retry actions instead of wait
      await sleep(2000);
      //https://github.com/puppeteer/puppeteer
      //advantage of automation and ui testing with puppteer
      const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.goTo(`${HOST}:${PORT}`);
      const pageContent = await page.content();
      fs.WriteFileSync(`${paths.clientBuild}/index.html`, pageContent);
      await browser.close();
      script.emit('quit')
    } catch (error) {
      script.emit('quit');
      logMessage(error, 'error')
    }
  });
  script.on('exit', (code: number) => {
    logMessage(`check this code for more info: ${code}`)
    process.exit(code);
  });

  script.on('crash', () => {
    logMessage('app crashed!!!', 'error')
    process.exit(1);
  });

};
const build = async () => {
  //first clean build src's
  rimraf.sync(paths.clientBuild);
  rimraf.sync(paths.serverBuild);
  const [clientConfig, serverConfig] = webpackConfig;
  const multiCompiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = multiCompiler.compilers.find(compiler => compiler.name === 'client');
  const serverCompiler = multiCompiler.compilers.find(compiler => compiler.name === 'server');
  const clientPromise = compilerPromise('client', clientCompiler);
  const serverPromise = compilerPromise('client', serverCompiler);

  serverCompiler.watch({}, (error: any, stats: any) => {
    if (!error && !stats.hasErrors()) {
      logMessage(stats.toString(serverConfig.stats), 'info');
      return
    }
    logMessage(stats.compilation.errors, 'error')
  });
  clientCompiler.watch({}, (error: any, stats: any) => {
    if (!error && !stats.hasErrors()) {
      logMessage(stats.toString(clientConfig.stats), 'info');
      return
    }
    logMessage(stats.compilation.errors, 'error')
  });

  //now we need for waiting for server and client so await!

  try {
    await clientPromise;
    await serverPromise;
    await generateStaicHTML();
    logMessage('Job Done!', 'info');
  } catch (error) {
    logMessage(error, 'error')
  }
}
build();
