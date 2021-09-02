// import React, { Suspense } from 'react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, Route, Switch } from 'react-router-dom';
import favicon from '../shared/assets/favicon.png';
import Home from './pages/Home';
import Page1 from './pages/Page-1';
import Page2 from './pages/Page-2';
import routes from './routes';

// Does not yet work with server side rendering:
// const Home = React.lazy(() => import('./pages/Home'));
// const Page1 = React.lazy(() => import('./pages/Page-1'));
// const Page2 = React.lazy(() => import('./pages/Page-2'));

const App: React.FC<any> = () => {
    return (
        // <Suspense fallback={<div>Loading</div>}>
        <div>
            <Helmet
                defaultTitle="3click - main page"
                titleTemplate="%s – 3click"
                link={[{ rel: 'icon', type: 'image/png', href: favicon }]}
            />
            <Switch>
                <Route exact path={routes.home} component={Home} />
                <Route exact path={routes.page1} component={Page1} />
                <Route exact path={routes.page2} component={Page2} />
                <Route render={() => '404!'} />
            </Switch>
        </div>
        // </Suspense>
    );
};

export default App;
