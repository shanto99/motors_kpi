import React from "react";
import {withStyles} from "@mui/styles";

import {logout} from "../../API/authentication";

import styles from "./styles";
import {Button} from "@mui/material";
import {Redirect} from "react-router-dom";

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: true
        }
    }

    makeLogout = () => {
        logout().then(res => {
            if(res.status === 200) {
                this.setState({
                    isAuthenticated: false
                })
            }
        }).catch(err => {

        });
    }

    render() {
        const classes = this.props.classes;
        if(!this.state.isAuthenticated) return (<Redirect to="/login"/>)
        return (
            <div className={classes.navbarContainer}>
                <div>
                    <h4>Dashboard</h4>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={this.makeLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Navbar);
