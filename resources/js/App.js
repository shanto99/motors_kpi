import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Login from "./layouts/login/Login";
import Dashboard from "./layouts/dashboard/Dashboard";
import {CssBaseline} from "@mui/material";

class App extends React.Component {
    render() {
        return (
            <>
                <CssBaseline/>
                <Router basename="motors_kpi">
                    <Switch>
                        <Route exact={true} path="/" component={Login}/>
                        <Route exact={true} path="/dashboard" component={Dashboard}/>
                    </Switch>
                </Router>
            </>
        )
    }
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
