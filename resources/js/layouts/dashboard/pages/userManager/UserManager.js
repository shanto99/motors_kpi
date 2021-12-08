import React from "react";

import {getAllUsers, createUser, getUsersWithPagination} from "../../../../API/userManager";
import {Grid, Box, TextField, Button, Select,
    FormControl, InputLabel, Autocomplete, MenuItem} from "@mui/material";
import swal from "sweetalert";
import {withStyles} from "@mui/styles";
import {Edit, Delete} from "@mui/icons-material";

import PaginationTable from "../../../../components/paginationTable/PaginationTable";

import styles from "./styles";
import { getAllDesignations } from "../../../../API/designation";

class UserManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            designations: [],
            userId: '',
            userName: '',
            userDesignation: '',
            userPassword: '',
            userEmail: '',
            userPhone: '',
            supervisor: null,
            users: [],
            sign: null
        };
    }

    componentDidMount() {
        Promise.all([getAllDesignations(), getAllUsers()]).then(responses => {
            const designations = responses[0].designations || [];
            const users = responses[1].users || [];

            this.setState({
                designations: designations,
                users: users
            });
        });
    }

    fetchAllUsers = () => {
        getAllUsers().then(res => {
            this.setState({
                users: res.users || []
            });
        })
    }

    handleSupervisorChange = (event, supervisor) => {
        this.setState({
           supervisor: supervisor
        });
    }

    handleUserFormSubmit = (e) => {
        e.preventDefault();
        let supervisorId = null;
        const {userId, userName, userDesignation, userEmail, userPassword, userPhone, sign} = this.state;
        if(this.state.supervisor) {
            supervisorId = this.state.supervisor.UserID;
        }

        createUser(userId, userName, userDesignation, userEmail, userPassword, sign, supervisorId).then(res => {
            this.fetchAllUsers();
            this.resetForm();
            swal("Added", "User added successfully", "success");
        }).catch(err => {
            swal("Error", "Could not add user", "error");
        })

    }

    resetForm = () => {
        this.setState({
            userId: '',
            userName: '',
            userDesignation: '',
            userPassword: '',
            userEmail: '',
            userPhone: '',
            supervisor: null,
            sign: null
        })
    }

    handleDesignationChange = (e) => {
        let value = e.target.value;
        this.setState({
            userDesignation: value
        });
    }

    editUser = (userId) => {
        const userDetails = this.state.users.find(user => user.UserID === userId);
        this.setState(preState => {
            let newState = {...preState};
            newState.userId = userDetails.UserID || "";
            newState.userName = userDetails.UserName || "";
            newState.userDesignation = userDetails.Designation || ""
            newState.userPassword = userDetails.UserPassword || "";
            newState.userEmail = userDetails.Email || "";
            newState.supervisor = userDetails.supervisor || null;
            return newState;

        });
    }

    deleteUser = () => {

    }

    handleImageSelect = (e) => {
        const files = e.target.files;
        this.setState({
            sign: files[0]
        });
    }

    render() {
        const {classes} = this.props;
        const {users, designations} = this.state;

        return (
            <Grid container spacing={4}>
                <Grid item lg={8}>
                    <PaginationTable title="All users"
                                     columns={[
                                         {title: 'User ID', field: 'UserID'},
                                         {title: 'User name', field: 'UserName'},
                                         {title: 'Email', field: 'Email'},
                                         {title: 'Actions', field: 'UserID', render: user => {
                                                 return (
                                                     <div style={{textAlign: 'center'}}>
                                                         <Button onClick={() => this.editUser(user.UserID)}>
                                                             <Edit color="primary"/>
                                                         </Button>
                                                         <Button onClick={() => this.deleteUser(user.UserID)}>
                                                             <Delete color="secondary"/>
                                                         </Button>
                                                     </div>
                                                 )
                                             }}
                                     ]}
                                     dataSource={getUsersWithPagination} />
                </Grid>
                <Grid item lg={4}>
                    <Box component="form" onSubmit={this.handleUserFormSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userId"
                            label="User id"
                            value={this.state.userId}
                            name="UserID"
                            autoComplete="off"
                            onChange={e => this.setState({
                                userId: e.target.value
                            })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userName"
                            label="User name"
                            name="UserName"
                            value={this.state.userName}
                            autoComplete="off"
                            onChange={e => this.setState({
                                userName: e.target.value
                            })}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.userDesignation}
                                label="Designation"
                                onChange={this.handleDesignationChange}
                            >
                                <MenuItem value="">
                                    <em>Select designation</em>
                                </MenuItem>
                                {designations.map(designation => (
                                    <MenuItem value={designation.DesignationID}>
                                        {designation.Designation}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            id="userPassword"
                            label="Password"
                            name="UserPassword"
                            value={this.state.userPassword}
                            autoComplete="off"
                            onChange={e => this.setState({
                                userPassword: e.target.value
                            })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="userEmail"
                            label="Email"
                            name="Email"
                            value={this.state.userEmail}
                            onChange={(e) => {
                                this.setState({
                                    userEmail: e.target.value
                                })
                            }}
                            autoComplete="off"
                        />
                        <Autocomplete
                            renderInput={(params) => <TextField {...params} label="Supervisor" />}
                            getOptionLabel={(option) => option.UserName}
                            value={this.state.supervisor}
                            onChange={this.handleSupervisorChange}
                            options={users}
                        />
                        <br/>
                        <input type="file" onChange={this.handleImageSelect} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Save user
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(UserManager);
