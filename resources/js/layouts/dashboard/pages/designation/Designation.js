import React from "react";
import {Grid, Box, TextField, List, ListItem, ListItemText, Button, FormControl} from "@material-ui/core";

import {getAllDesignations, createDesignation} from "../../../../API/designation";

class Designation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            designations: []
        }
    }

    componentDidMount()
    {
        getAllDesignations().then(res => {
            this.setState({
                designations: res.designations
            });
        }).catch(err => {
            console.log(err);
        });
    }

    handleDesignationSubmit = () => {
        const {designation} = this.state;
        createDesignation(designation).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        });

    }

    render()
    {
        const {designations} = this.state;
        return (
            <Grid container spacing={4}>
                <Grid item lg={6} md={6}>
                    <List>
                        {designations.map(designation => (
                            <ListItem>
                                <ListItemText primary={designation.Designation} />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item lg={6} md={6}>
                    <Box>
                        <div style={{ marginBottom: '20px' }}>
                            <TextField
                                variant="outlined"
                                label="Designation"
                                value={this.state.designation}
                                onChange={e => {
                                    this.setState({
                                        designation: e.target.value
                                    });
                                }}
                            />
                        </div>
                        <Button
                            variant="outlined"
                            onClick={this.handleDesignationSubmit}
                        >
                            Create
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        )
    }

}

export default Designation;