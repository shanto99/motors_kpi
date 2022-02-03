import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import React from "react";
import Cookies from "js-cookie";
import "./style.css";
import { Hidden } from "@mui/material";

import {changePassword} from "../../API/authentication";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
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
    }

    render() {
        const user = this.state.user;
        return (
            <div className="headerWrapper">
                <div>
                    <Hidden mdUp>
                      <span onClick={this.props.openSidePanel}>
                        <MenuIcon fontSize="large" />
                      </span>
                    </Hidden>

                </div>
                <div style={{ display: 'flex', textAlign: 'center', cursor: 'pointer', justifyContent: 'flex-end' }} onClick={this.changePassword}>
                    <section>
                        <AccountCircle fontSize="large"/>
                        <div>{user ? user.UserName : 'user name'}</div>
                    </section>

                </div>
            </div>
        )
    }
}

export default Header;
