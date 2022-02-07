import React from "react";
import {Autocomplete, Box, Button, Grid, ListItemIcon,
    List, ListItem, ListItemText, ListItemButton} from "@mui/material";

import {getCriterias, createCriteria, updateCriteriaRemarks} from "../../../../API/criteria";
import {FormControl, Select, InputLabel, TextField, MenuItem} from "@material-ui/core";
import {Add as AddIcon, Edit as EditIcon} from "@mui/icons-material";
import swal from "sweetalert";

class Criteria extends React.Component {
    constructor(props) {
        super(props);
        this.editingCriteria = null;


        this.state = {
            criteria: "",
            subCriteria: "",
            name: '',
            remarks: '',
            unit: '',
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
        const subSubCriteria = this.editingCriteria && this.editingCriteria.SubSubCriteriaID;
        let {name, criteria, subCriteria, remarks, unit} = this.state;
        const isEditing = this.editingCriteria ? true : false;
        createCriteria(name, remarks, criteria, subCriteria, subSubCriteria, unit, isEditing).then(res => {
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

    editCriteria = (criteriaId="", subCriteriaId="", subSubCriteriaId="") => {
        const criteria = this.state.criterias.find(criteria => criteria.CriteriaID == criteriaId);
        let editingCriteria = criteria;
        let subCriterias = criteria.sub_criterias;
        if(subCriteriaId !== "") {
            subCriterias = criteria.sub_criterias;
            editingCriteria = subCriterias.find(subCriteria => subCriteria.SubCriteriaID == subCriteriaId);

        }

        if(subSubCriteriaId !== "") {
            let subSubCriterias = editingCriteria.sub_sub_criterias;
            editingCriteria = subSubCriterias.find(criteria => criteria.SubSubCriteriaID == subSubCriteriaId);
        }

        this.editingCriteria = editingCriteria;

        this.setState(preState => {
            const newState = {...preState};
            newState.name = editingCriteria.Name;
            newState.criteria = criteriaId;
            newState.subCriterias = subCriterias;
            newState.subCriteria = subCriteriaId;
            newState.unit = editingCriteria.Unit;
            newState.remarks = editingCriteria.Remarks;
            return newState;
        });
    }

    render() {
        const {criterias, subCriterias} = this.state;
        return (
            <Grid container spacing={4}>
                <Grid item lg={4}>
                    <h5>All criteria</h5>
                    <div style={{maxHeight: '74vh', overflow: 'auto'}}>
                        <List
                        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                    >
                        <List>
                            {criterias.map(criteria => {
                                return (
                                    <React.Fragment>
                                        <ListItemButton>
                                            <ListItemText primary={criteria.Name} />
                                            <ListItemIcon>
                                                <EditIcon fontSize="medium" onClick={() => this.editCriteria(criteria.CriteriaID)} />
                                            </ListItemIcon>
                                        </ListItemButton>
                                        {criteria.sub_criterias
                                        ? <List
                                                style={{ paddingLeft: '20px' }}
                                            >
                                                {criteria.sub_criterias.map(subCriteria => (
                                                    <React.Fragment>
                                                        <ListItemButton>
                                                            <ListItemText primary={subCriteria.Name} />
                                                            <ListItemIcon><EditIcon fontSize="medium" onClick={() => this.editCriteria(criteria.CriteriaID, subCriteria.SubCriteriaID)}/></ListItemIcon>
                                                        </ListItemButton>
                                                        {subCriteria.sub_sub_criterias
                                                        ? <List
                                                                style={{ paddingLeft: '20px' }}
                                                            >
                                                                {subCriteria.sub_sub_criterias.map(subSubCriteria => {
                                                                    return (
                                                                        <ListItemButton>
                                                                            <ListItemText primary={subSubCriteria.Name}/>
                                                                            <ListItemIcon><EditIcon fontSize="medium" onClick={() => this.editCriteria(criteria.CriteriaID, subCriteria.SubCriteriaID, subSubCriteria.SubSubCriteriaID)} /></ListItemIcon>
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
                    </div>
                </Grid>
                <Grid item lg={6}>
                    <Box component="form" style={{ maxWidth: '400px' }} onSubmit={this.handleCriteriaSubmit}>
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
                                disabled={this.editingCriteria ? true : false}
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
                                disabled={this.editingCriteria ? true : false}
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
                        <TextField
                            margin="normal"
                            label="Remarks"
                            value={this.state.remarks}
                            fullWidth
                            onChange={(e) => this.setState({
                                remarks: e.target.value
                            })}
                        />
                        <br/>
                        <TextField
                            margin="normal"
                            label="Unit"
                            value={this.state.unit}
                            fullWidth
                            onChange={(e) => this.setState({
                                unit: e.target.value
                            })}
                        />
                        <br/><br/>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        );
    }
}

export default Criteria;
