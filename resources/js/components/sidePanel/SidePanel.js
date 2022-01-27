import React from "react";
import {withStyles} from "@mui/styles";
import {Close as CloseIcon} from "@mui/icons-material";
import {Typography, List, ListItem, ListItemIcon, ListItemText, Hidden} from "@mui/material";
import styles from "./styles";
import {Link, Redirect} from "react-router-dom";
import Cookies from "js-cookie";

import {logout} from "../../API/authentication";

class SidePanel extends React.Component {
    constructor(props)
    {
        super(props);
        let isAdmin = false;
        let isApprover = false;
        const userJson = Cookies.get('user');
        if(userJson) {
            let userObj = null;
            try{
                userObj = JSON.parse(userJson);
            } catch(error) {
                console.log("Could not parse user json");
            }
           isAdmin = userObj && userObj.IsAdmin && userObj.IsAdmin.toString() === "1" ? true : false; 
           isApprover = userObj && userObj.IsApprover && userObj.IsApprover.toString() === "1" ? true : false; 
        }

        this.state = {
            isAdmin: isAdmin,
            isAuthenticated: true,
            isApprover: isApprover
        };
        
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
        const isAdmin = this.state.isAdmin;
        const isApprover = this.state.isApprover;

        if(!this.state.isAuthenticated) return (<Redirect to="/login"/>)
        return (
            <div className={classes.sidePanelContainer}>
                <section style={{marginBottom: '20px'}}>
                    <div className="sidePanelHeader">
                        <Typography variant="h4" component="div" style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                            Motors KPI <Hidden mdUp><span onClick={this.props.closeSidePanel}><CloseIcon fontSize="large"/></span></Hidden>
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
                        { !isApprover
                        ? <Link to="/kpi" className={classes.menuItem}>
                            <ListItem>
                                    <ListItemText>
                                        KPI
                                    </ListItemText>
                                </ListItem>
                            </Link>
                        : null}
                        
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

                        {!(isAdmin || isApprover)
                        ? <Link to="/set-target" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Set target
                                </ListItemText>
                            </ListItem>
                        </Link>
                        : null}
                        
                        <Link to="/approve-target" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Approve target
                                </ListItemText>
                            </ListItem>
                        </Link>
                        {!(isAdmin || isApprover)
                         ? <Link to="/actual-input" className={classes.menuItem}>
                                <ListItem>
                                    <ListItemText>
                                        Input actual
                                    </ListItemText>
                                </ListItem>
                            </Link>
                        : null}

                        <Link to="/report" className={classes.menuItem}>
                            <ListItem>
                                <ListItemText>
                                    Report
                                </ListItemText>
                            </ListItem>
                        </Link>
                        
                    </List>
                </section>
                <div>
                    <button className={classes.logoutBtn} onClick={this.makeLogout}>
                       <span><img src="/motors_kpi/images/exit_icon.svg"/></span> Logout
                    </button>
                    
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(SidePanel);
