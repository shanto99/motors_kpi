import React from "react";
import {Grid} from "@mui/material";
import {withStyles} from "@mui/styles";

import SidePanel from "../../components/sidePanel/SidePanel";
import Navbar from "../../components/navBar/Navbar";

import styles from  "./styles";

class Dashboard extends React.Component {
    render() {
        const classes = this.props.classes;
        return (
            <Grid container className={classes.pageWrapper}>
                <Grid item lg={2} className={classes.sidePanel}>
                    <SidePanel/>
                </Grid>
                <Grid item lg={10} className={classes.mainBody}>
                    <Navbar/>

                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Dashboard);
