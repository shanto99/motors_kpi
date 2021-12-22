import React from "react";
import {withStyles} from "@mui/styles";
import {Category as CategoryIcon, Dashboard as DashboardIcon, SupervisedUserCircle} from "@mui/icons-material";
import {Typography, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import styles from "./styles";
import {Link} from "react-router-dom";
import Cookies from "js-cookie";

class SidePanel extends React.Component {
    constructor(props)
    {
        super(props);
        let isAdmin = false;
        const userJson = Cookies.get('user');
        if(userJson) {
            let userObj = null;
            try{
                userObj = JSON.parse(userJson);
            } catch(error) {
                console.log("Could not parse user json");
            }
           isAdmin = userObj && userObj.IsAdmin.toString() === "1" ? true : false; 
        }

        this.state = {
            isAdmin: isAdmin
        };
        
    }
    render() {
        const classes = this.props.classes;
        const isAdmin = this.state.isAdmin;
        return (
            <div className={classes.sidePanelContainer}>
                <section>
                    <div className="sidePanelHeader">
                        <Typography variant="h4" component="div" style={{ fontWeight: 'bold' }}>
                            Motors KPI
                        </Typography>
                        <Typography variant="p" gutterBottom component="div" style={{ color: 'gray', fontSize: '16px' }}>
                            Keep your Performance Indicator Board Updated!
                        </Typography>
                    </div>

                    <List className="sidebarMenuList">
                        <Link to="/" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Dashboard
                                </ListItemText>
                            </ListItem>
                        </Link>
                        <Link to="/kpi" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    KPI
                                </ListItemText>
                            </ListItem>
                        </Link>
                        <Link to="/approve-kpi" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Approve KPI
                                </ListItemText>
                            </ListItem>
                        </Link>
                        {isAdmin
                        ? <Link to="/designation" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Designation
                                </ListItemText>
                            </ListItem>
                        </Link>
                        : null}
                        {isAdmin
                        ? <Link to="/user-manager" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    User manager
                                </ListItemText>
                            </ListItem>
                        </Link>
                        : null}
                        {isAdmin
                        ? <Link to="/criteria" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Criteria
                                </ListItemText>
                            </ListItem>
                        </Link>
                        : null}
                        
                        {isAdmin
                        ? <Link to="/assign-criteria" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Assign criteria
                                </ListItemText>
                            </ListItem>
                        </Link>
                        : null}
                        
                        <Link to="/set-target" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Set target
                                </ListItemText>
                            </ListItem>
                        </Link>
                        <Link to="/approve-target" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Approve target
                                </ListItemText>
                            </ListItem>
                        </Link>
                        <Link to="/actual-input" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Input actual
                                </ListItemText>
                            </ListItem>
                        </Link>
                    </List>
                </section>
                <div>
                    Logout
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(SidePanel);
