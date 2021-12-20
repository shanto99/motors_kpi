import React from "react";
import {Autocomplete, Box, Button, Grid, List, ListItem, ListItemButton} from "@mui/material";

import {getCriterias, createCriteria} from "../../../../API/criteria";
import {FormControl, Select, InputLabel, ListItemIcon, ListItemText, ListSubheader, MenuItem, TextField} from "@material-ui/core";
import {Add as AddIcon} from "@mui/icons-material";
import swal from "sweetalert";

class Criteria extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criteria: "",
            subCriteria: "",
            name: '',
            criterias: [],
            subCriterias: []
        }
    }

    componentDidMount() {
        this.getAllCriterias();
    }

    getAllCriterias = () => {
        getCriterias().then(res => {
            this.setState({
                criterias: res.criterias || []
            });
        });
    }

    handleCriteriaSubmit = (e) => {
        e.preventDefault();
        const {name, criteria, subCriteria} = this.state;
        createCriteria(name, criteria, subCriteria).then(res => {
            swal("Created!!", "New criteria created", "success");
            this.getAllCriterias();
        }).catch(err => {
            swal("Error!!", "Could not create criteria", "error");
            console.log("Could not create criteria: ", err);
        });
    }

    handleCriteriaSelect = (event) => {
        let  value = event.target.value;
        let criteria = this.state.criterias.find(criteria => criteria.CriteriaID === value);
        let subCriterias = criteria && criteria.sub_criterias || [];
        this.setState({
          criteria: value,
          subCriterias: subCriterias
        });
    }

    handleSubCriteriaSelect = (event) => {
        let  value = event.target.value;
        //let subCriteria = this.state.subCriterias.find(subCriteria => subCriteria.SubCriteriaID === value);
        this.setState({
            subCriteria: value
        });
    }

    render() {
        const {criterias, subCriterias} = this.state;
        return (
            <Grid container spacing={4}>
                <Grid item lg={8}>
                    <h5>All criteria</h5>
                    <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    >
                        <List>
                            {criterias.map(criteria => {
                                return (
                                    <React.Fragment>
                                        <ListItemButton>
                                            <ListItemText primary={criteria.Name} />
                                        </ListItemButton>
                                        {criteria.sub_criterias
                                        ? <List
                                                style={{ paddingLeft: '20px' }}
                                            >
                                                {criteria.sub_criterias.map(subCriteria => (
                                                    <React.Fragment>
                                                        <ListItemButton>
                                                            <ListItemText primary={subCriteria.Name} />
                                                        </ListItemButton>
                                                        {subCriteria.sub_sub_criterias
                                                        ? <List
                                                                style={{ paddingLeft: '20px' }}
                                                            >
                                                                {subCriteria.sub_sub_criterias.map(subSubCriteria => {
                                                                    return (
                                                                        <ListItemButton>
                                                                            <ListItemText primary={subSubCriteria.Name}/>
                                                                        </ListItemButton>
                                                                    )
                                                                })}
                                                          </List>
                                                        : null}
                                                    </React.Fragment>
                                                ))}
                                          </List>
                                        : null}
                                    </React.Fragment>
                                )
                            })}
                        </List>
                    </List>
                </Grid>
                <Grid item lg={4}>
                    <Box component="form" onSubmit={this.handleCriteriaSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Criteria"
                            value={this.state.name}
                            autoComplete="off"
                            onChange={e => this.setState({
                                name: e.target.value
                            })}
                        />
                        <br/>
                        <FormControl fullWidth style={{ marginBottom: '15px' }} >
                            <InputLabel id="criteria-select">Criteria</InputLabel>
                            <Select
                                labelId="criteria-select"
                                value={this.state.criteria}
                                label="Criteria"
                                onChange={this.handleCriteriaSelect}
                            >
                                <MenuItem value="">Select criteria</MenuItem>
                                {criterias.map(criteria => {
                                    return (
                                        <MenuItem value={criteria.CriteriaID}>{criteria.Name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <br/>
                        <FormControl fullWidth style={{ marginBottom: '15px' }}>
                            <InputLabel id="sub-criteria-select">Sub criteria</InputLabel>
                            <Select
                                labelId="sub-criteria-select"
                                value={this.state.subCriteria}
                                label="Sub criteria"
                                onChange={this.handleSubCriteriaSelect}
                            >
                                <MenuItem value="">Select sub criteria</MenuItem>
                                {subCriterias.map(criteria => {
                                    return (
                                        <MenuItem value={criteria.SubCriteriaID}>{criteria.Name}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                        <br/>
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
        );
    }
}

export default Criteria;
