import { AccountCircle } from "@mui/icons-material";
import React from "react";
import "./style.css";

class Header extends React.Component {
    render() {
        return (
            <div className="headerWrapper">
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                    <AccountCircle fontSize="large"/>
                    <div>User one</div>
                </div>
            </div>
        )
    }
}

export default Header;