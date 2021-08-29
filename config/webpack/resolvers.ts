import path from 'path';
import paths from '../paths';

const getDependenciesPath = (depName: string) => path.join(__dirname, '..', '..', 'node_modules', depName)

export default {
    extentions: ['.js', '.json', '.jsx', '.ts', '.tsx', '.css'],
    module: paths.resolveModules,
    // this resolvers are for loading the dependencies from
    //  the same package(with same version) in all around the project
    alias: {
        'react': require.resolve('react'),
        'react-dom': require.resolve('react-dom'),
        'react-router': getDependenciesPath('react-router'),
        'react-router-dom': getDependenciesPath('react-router-dom')
    }
}
