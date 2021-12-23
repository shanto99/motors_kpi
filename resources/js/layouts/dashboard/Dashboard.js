import React from "react";
import {Grid} from "@mui/material";
import {withStyles} from "@mui/styles";
import {Redirect, Route, Switch} from "react-router-dom";

import SidePanel from "../../components/sidePanel/SidePanel";

// pages
import Home from "./pages/home/Home";
import UserManager from "./pages/userManager/UserManager";
import Criteria from "./pages/criteria/Criteria";
import AssignCriteria from "./pages/assignCriteria/AssignCriteria";
import SetTarget from "./pages/setTarget/SetTarget";
import ActualInput from "./pages/inputActual/ActualInput";
import KPI from "./pages/kpi/KPI";
import ApproveTarget from "./pages/approveTarget/ApproveTarget";
import ApproveKPI from "./pages/approveKPI/ApproveKPI";

import { getUser } from "../../API/authentication";

import styles from  "./styles";
import Designation from "./pages/designation/Designation";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isAuthenticated: true
        }
    }

    componentDidMount()
    {
        getUser().then(res => {
            this.setState({
                isAuthenticated: true
            });
        }).catch(err => {
            this.setState({
                isAuthenticated: false
            })
        })
    }

    render() {
        const classes = this.props.classes;
        const {isAuthenticated} = this.state;
        return (
            <div className={classes.appContainer}>
                {isAuthenticated
                ?   <Grid container className={classes.pageWrapper}>
                        <Grid item lg={2} className={classes.sidePanel}>
                            <SidePanel/>
                        </Grid>
                        <Grid item lg={10} className={classes.mainBody}>
                            <>
                                <Route exact={true} path="/" component={Home} />
                                <Route exact={true} path="/user-manager" component={UserManager}/>
                                <Route exact={true} path="/kpi" component = {KPI} />
                                <Route exact path="/assign-criteria" component={AssignCriteria}/>
                                <Route exact={true} path="/criteria" component={Criteria}/>
                                <Route exact={true} path="/designation" component={Designation} />
                                <Route exact={true} path="/set-target" component={SetTarget} />
                                <Route exact={true} path="/actual-input" component={ActualInput} />
                                <Route exact={true} path="/approve-target" component={ApproveTarget} />
                                <Route exact={true} path="/approve-kpi" component={ApproveKPI} />
                            </>
                        </Grid>
                    </Grid>
                : <Redirect to="/login" />}

            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);
