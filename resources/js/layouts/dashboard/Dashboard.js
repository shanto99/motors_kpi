import React from "react";
import {Grid} from "@mui/material";
import {withStyles} from "@mui/styles";
import {Redirect, Route, Switch} from "react-router-dom";

import SidePanel from "../../components/sidePanel/SidePanel";
import Navbar from "../../components/navBar/Navbar";

// pages
import Home from "./pages/home/Home";
import UserManager from "./pages/userManager/UserManager";
import Criteria from "./pages/criteria/Criteria";
import AssignCriteria from "./pages/assignCriteria/AssignCriteria";
import CriteriaForm from "./pages/criteriaForm/CriteriaForm";

import { getUser } from "../../API/authentication";

import styles from  "./styles";

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
            <React.Fragment>
                {isAuthenticated
                ?   <Grid container className={classes.pageWrapper}>
                        <Grid item lg={2} className={classes.sidePanel}>
                            <SidePanel/>
                        </Grid>
                        <Grid item lg={10} className={classes.mainBody}>
                            <Navbar/>
                            <>
                                <Route exact={true} path="/" component={Home} />
                                <Route exact={true} path="/user-manager" component={UserManager}/>
                                <Route exact path="/assign-criteria" component={AssignCriteria}/>
                                <Route exact path="/criteria-form" component={CriteriaForm} />
                                <Route exact={true} path="/criteria" component={Criteria}/>
                            </>
                        </Grid>
                    </Grid>
                : <Redirect to="/login" />}

            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Dashboard);
