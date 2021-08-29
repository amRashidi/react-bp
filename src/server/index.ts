import path from 'path';
import express from 'express';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import paths from '../../config/paths';

require('dotenv').config();

const app = express();

app.use(paths.publicPath, express.static(path.join(paths.clientBuild, paths.publicPath)));

//TODO: add store server


const manifestPath = path.join(paths.clientBuild, paths.publicPath);

app.use(
    manifestHelpers({
        manifestPath: `${manifestPath}/manifest.json`,
    })
);


app.listen(process.env.PORT || 8500, () => {
    console.log(
        `[${new Date().toISOString()}]`,
        chalk.blue(`App is running: http://localhost:${process.env.PORT || 8500}`)
    );
});

export default app;
