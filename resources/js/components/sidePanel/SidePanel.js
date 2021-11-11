import React from "react";
import {withStyles} from "@mui/styles";
import {Dashboard as DashboardIcon} from "@mui/icons-material";
import {Typography, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import styles from "./styles";

class SidePanel extends React.Component {
    render() {
        const classes = this.props.classes;
        return (
            <div className={classes.sidePanelContainer}>
                <div className="sidePanelHeader">
                    <Typography variant="h5" align="center" gutterBottom component="div">
                        Motors KPI
                    </Typography>
                </div>

                <List>
                    <ListItem>
                        <ListItemIcon>
                            <DashboardIcon/>
                        </ListItemIcon>
                        <ListItemText>
                            Dashboard
                        </ListItemText>
                    </ListItem>
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(SidePanel);
