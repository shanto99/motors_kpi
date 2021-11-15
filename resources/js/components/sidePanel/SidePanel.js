import React from "react";
import {withStyles} from "@mui/styles";
import {Category as CategoryIcon, Dashboard as DashboardIcon, SupervisedUserCircle} from "@mui/icons-material";
import {Typography, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import styles from "./styles";
import {Link} from "react-router-dom";

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
                    <Link to="/">
                        <ListItem>
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                Dashboard
                            </ListItemText>
                        </ListItem>
                    </Link>
                    <Link to="/user-manager">
                        <ListItem>
                            <ListItemIcon>
                                <SupervisedUserCircle/>
                            </ListItemIcon>
                            <ListItemText>
                                User manager
                            </ListItemText>
                        </ListItem>
                    </Link>
                    <Link to="/criteria">
                        <ListItem>
                            <ListItemIcon>
                                <CategoryIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                Criteria
                            </ListItemText>
                        </ListItem>
                    </Link>
                    <Link to="/assign-criteria">
                        <ListItem>
                            <ListItemIcon>
                                <CategoryIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                Assign criteria
                            </ListItemText>
                        </ListItem>
                    </Link>
                </List>
            </div>
        );
    }
}

export default withStyles(styles)(SidePanel);
