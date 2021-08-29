import rimraf from 'rimraf';
import paths from '../config/paths';
export const clientOnly = () => process.argv.includes('--client-only');
rimraf.sync(paths.clientBuild);
rimraf.sync(paths.serverBuild);

if (clientOnly()) {
    require('./start-client');
} else {
    require('./start-ssr');
}
