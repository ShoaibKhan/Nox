import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import store from './store';

import StudentJoinScreen from './views/student/StudentJoinScreen';
import StudentApp from './views/student/StudentApp';
import UoftAuthScreen from './views/auth/UoftAuthScreen';
import ProfSessions from './views/professor/ProfSessions';
import ProfDashboard from './views/professor/ProfDashboard';
import ProfPollLive from './views/professor/ProfPollLive';

import './App.css';

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="App">
        <Switch>
          <Route path="/nox/login" exact component={UoftAuthScreen} />
          <Route path="/nox/student" exact component={StudentApp} />
          <Route path="/nox/professor" exact component={ProfSessions} />
          <Route path="/nox/professor/dashboard" exact component={ProfDashboard} />
          <Route path="/nox/professor/poll" exact component={ProfPollLive} />
          <Route path="/nox" exact component={StudentJoinScreen} />
          <Route path="/" exact render={() => <Redirect to="/nox" />} />
          <Route render={() => <Redirect to="/nox" />} />
        </Switch>
      </div>
    </Router>
  </Provider>
);

export default App;
