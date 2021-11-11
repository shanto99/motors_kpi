import React from "react";
import {Avatar, Box, Container, TextField, Typography, Button} from "@mui/material";
import {Lock as LockIcon} from "@mui/icons-material";
import {withStyles} from "@mui/styles";

import {login} from "../../API/authentication";

import styles from "./styles";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: '',
            password: ''
        }
    }

    handleUserInput = (value, field) => {
        this.setState(preState => {
            const newSate = {...preState};
            newSate[field] = value;
            return newSate;
        })
    }

    handleLogin = (e) => {
        e.preventDefault();
        const {userId, password} = this.state;
        login(userId, password).then(res => {
            console.log(res);
        }).catch(err => {
            console.log("Login failed: ", err);
        })
    }

    render() {
        return (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" noValidate sx = {{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="staffId"
                            label="Staff id"
                            autoFocus
                            onChange={(e) => this.handleUserInput(e.target.value, 'userId')}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            type="password"
                            onChange={(e) => this.handleUserInput(e.target.value, 'password')}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={this.handleLogin}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        );
    }
}

export default withStyles(styles)(Login);


