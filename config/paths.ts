import path from 'path';
 import fs from 'fs';

 const appDir = fs.realpathSync(process.cwd());
 const resolveApp =  (relativePath : string) => path.resolve(appDir,relativePath);

 const paths: any = {
     appHtml: resolveApp('config/webpack.config.ts/template.html'),
     clientBuild: resolveApp('build/client'),
     serverBuild:resolveApp('build/server'),
     dotenv: resolveApp('.env'),
     src: resolveApp('src'),
     srcClient: resolveApp('src/client'),
     srcServer: resolveApp('src/client'),
     srcShared: resolveApp('src/shared'),
     types: resolveApp('nodeModules/@types'),
     publicPath: '/static/'
 };
 paths.resolveModules = [
     paths.srcClient,
     paths.srcServer,
     paths.srcShared,
     paths.src,
     'node_modules',
 ];

 export default paths
