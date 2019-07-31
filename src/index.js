import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import AdminHome from './modules/AdminHome';
import AdminRoom from './modules/AdminRoom';
import UserHome from './modules/UserHome';
import UserRoom from './modules/UserRoom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
  <BrowserRouter>
    <div>
      <Switch>
        <Route path="/" exact component={UserHome} />
        <Route path="/admin" exact component={AdminHome} />
        <Route path="/admin/:room" component={AdminRoom} />
        <Route path="/:room/:userID(\d+)?" component={UserRoom} />
      </Switch>
    </div>
  </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
