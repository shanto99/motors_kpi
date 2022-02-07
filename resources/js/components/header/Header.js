import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import React from "react";
import Cookies from "js-cookie";
import "./style.css";
import { Hidden, Menu, MenuItem, Button } from "@mui/material";

import {changePassword} from "../../API/authentication";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            open: false,
            anchorEl: null
        }
    }
    componentDidMount(){
        let user = Cookies.get('user');
        user = user ? JSON.parse(user) : null;
        this.setState({
            user: user
        });
    }

    changePassword = () => {
        this.setState({
            open: false
        }, () => {
            swal({
            text: 'Change password',
            content: "input",
            button: {
                text: "Update!",
                closeModal: false,
            },
            })
            .then(newPassword => {
                if (!newPassword) throw null;
                changePassword(newPassword).then(res => {
                    swal("Updated!", "Password updated successfully", "success");
                });
            })
            .catch(err => {
                swal("Error!", "Something went wrong", "error");
            });
        });
    }

    handleClick = (e) => {
        this.setState({
            anchorEl: e.currentTarget,
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    render() {
        const {user, open} = this.state;

        return (
            <div className="headerWrapper">
                <div>
                    <Hidden mdUp>
                      <span onClick={this.props.openSidePanel}>
                        <MenuIcon fontSize="large" />
                      </span>
                    </Hidden>

                </div>
                <div style={{ display: 'flex', textAlign: 'center', cursor: 'pointer', justifyContent: 'flex-end' }}>
                    <section>
                        <AccountCircle fontSize="large"/>
                        <div>
                            <Button
                                id="basic-button"
                                aria-controls={open ? 'user-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={this.handleClick}
                            >
                                {user ? user.UserName : 'user name'}
                            </Button>
                            <Menu
                                id="user-menu"
                                anchorEl={this.state.anchorEl}
                                open={open}
                                onClose={this.handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem>
                                    <span>Supervisor: {user && user.supervisors && user.supervisors.length > 0 ? user.supervisors[0].supervisor.UserName : 'None'}</span>
                                </MenuItem>
                                <MenuItem
                                    onClick={this.changePassword}
                                >Change password</MenuItem>
                            </Menu>
                        </div>
                    </section>

                </div>
            </div>
        )
    }
}

export default Header;
