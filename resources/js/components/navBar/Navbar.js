import React from "react";
import {withStyles} from "@mui/styles";

import styles from "./styles";
import {Button} from "@mui/material";

class Navbar extends React.Component {
    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.navbarContainer}>
                <div>
                    <h4>Dashboard</h4>
                </div>
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Navbar);
