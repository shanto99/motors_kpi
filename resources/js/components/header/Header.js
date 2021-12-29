import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";
import React from "react";
import Cookies from "js-cookie";
import "./style.css";
import { Hidden } from "@mui/material";

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
                <div style={{ display: 'flex', textAlign: 'center', cursor: 'pointer', justifyContent: 'flex-end' }}>
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