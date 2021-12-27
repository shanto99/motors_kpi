import { AccountCircle } from "@mui/icons-material";
import React from "react";
import Cookies from "js-cookie";
import "./style.css";

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
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <AccountCircle fontSize="large"/>
                    <div>{user ? user.UserName : 'user name'}</div>
                </div>
            </div>
        )
    }
}

export default Header;