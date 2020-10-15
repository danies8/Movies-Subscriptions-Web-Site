import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LogInPage from './Login/LogInPage';
import MainPage from './MainPage/MainPage';
import common from '../Utils/Common'   ;

function MainComponent(props) {
    return (
        <div >
               <Switch>
               <Route  path={common.mainPage} component={MainPage} />
                <Route  path={common.login} component={LogInPage} />
            </Switch>
        </div>
    );
}

export default MainComponent;