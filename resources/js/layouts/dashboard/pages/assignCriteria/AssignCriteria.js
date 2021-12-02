import React from "react";
import swal from "sweetalert";
import {getCriterias} from "../../../../API/criteria";
import {getAllDesignations} from "../../../../API/designation";
import {Select, Container, FormControl, InputLabel, MenuItem,
    List, TextField, Button, ListItem} from "@mui/material";
import {ListSubheader} from "@material-ui/core";
import {withStyles} from "@mui/styles";

import {assignWeights, getWeights} from "../../../../API/weight";

import styles from './styles';

class AssignCriteria extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            designations: [],
            designation: "",
            criterias: [],
            reload: true,
            criteriaWeights: []
        }
    }

    componentDidMount() {
        Promise.all([getAllDesignations(), getCriterias()]).then(responses => {
            let designations = responses[0].designations;
            let criterias = responses[1].criterias;

            this.setState({
                designations: designations,
                criterias: criterias
            });
        });
    }

    findCriteria = (criteriaId, subCriteriaId, subSubCriteriaId, criteriaWeights) =>
    {
        let criteria = null;

        criteriaId = criteriaId.toString();
        if(subCriteriaId) subCriteriaId = subCriteriaId.toString();
        if(subSubCriteriaId) subSubCriteriaId = subSubCriteriaId.toString();

        if(subSubCriteriaId) {
            criteria = criteriaWeights.find(weight => weight.CriteriaID === criteriaId &&
                weight.SubCriteriaID === subCriteriaId &&
                weight.SubSubCriteriaID === subSubCriteriaId);
        } else if(subCriteriaId) {
            criteria = criteriaWeights.find(weight => weight.CriteriaID === criteriaId &&
                weight.SubCriteriaID === subCriteriaId);
        } else if(criteriaId) {
            criteria = criteriaWeights.find(weight => weight.CriteriaID === criteriaId);
        }

        return criteria;
    }

    getCriteriaValue = (criteriaId, subCriteria, subSubCriteria) => {
        let {criteriaWeights} = this.state;
        let criteria = this.findCriteria(criteriaId, subCriteria, subSubCriteria, criteriaWeights);
        
        return criteria && criteria.Weight || "";
        

    }

    handleCriteriaWeightChange = (criteriaId, subCriteria, subSubCriteria, inputValue) => {
        let {criteriaWeights} = this.state;
        let criteria = this.findCriteria(criteriaId, subCriteria, subSubCriteria, criteriaWeights);
        if(criteria) {
            criteria.Weight = inputValue;
        } else {
            let criteriaWeight = {
                CriteriaID: criteriaId,
                SubCriteriaID: subCriteria,
                SubSubCriteriaID: subSubCriteria,
                Weight: null,
                Target: null
            }
            criteriaWeight.Weight = inputValue
            criteriaWeights.push(criteriaWeight);
        }

        this.setState({
            criteriaWeights
        });
    }

    submitCriteriaWeights = () => {
        const designationId = this.state.designation;
        assignWeights(this.state.criteriaWeights, designationId).then(res => {
            swal("Assigned", "Criteria assign to this designation", "success");
            this.setState(preState => {
                const newState = {...preState};
                newState.reload = !preState.reload;
                return newState;
            })
        }).catch(err => {
            swal("Error", "Could not assign criteria", "error");
        })
    }

    handleDesignationChange = (event, designation) => {
        const designationId = event.target.value;
        getWeights(designationId).then(res => {
            this.setState({
                criteriaWeights: res.weights || [],
                designation: designationId
            });
        });

    }

    render() {
        const {designations, criterias} = this.state;
        const {classes} = this.props;
        return (
            <Container maxWidth="md">
                <FormControl style={{ width: '300px' }}>
                    <InputLabel id="demo-simple-select-label">Designation</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.designation}
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

                <List
                    className={classes.criteriaList}
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Criteria
                        </ListSubheader>
                    }
                >
                    {criterias.map(criteria => {
                       return (
                           <React.Fragment>
                               {criteria.sub_criterias.length > 0
                               ? <List
                                       style={{ paddingLeft: '40px' }}
                                       subheader={
                                           <ListSubheader component="div" id="nested-list-subheader">
                                               <h4>{criteria.Name}</h4>
                                           </ListSubheader>
                                       }
                                   >
                                       {criteria.sub_criterias.map(subCriteria => (
                                           <React.Fragment>
                                               {subCriteria.sub_sub_criterias.length > 0
                                               ? <List
                                                       style={{ paddingLeft: '40px' }}
                                                       subheader={
                                                           <ListSubheader component="div" id="nested-list-subheader">
                                                               <h4>{subCriteria.Name}</h4>
                                                           </ListSubheader>
                                                       }
                                                   >
                                                       {subCriteria.sub_sub_criterias.map(subSubCriteria => (
                                                           <ListItem>
                                                               <div className={classes.weightTargetFormContainer}>
                                                                   <h4>{subSubCriteria.Name}</h4>
                                                                   <div className="weightTargetForm">
                                                                       <TextField
                                                                           className="inputField"
                                                                           label="Weight"
                                                                           value={this.getCriteriaValue(criteria.CriteriaID.toString(),
                                                                               subCriteria.SubCriteriaID.toString(),
                                                                               subSubCriteria.SubSubCriteriaID.toString())}
                                                                           onChange={(e) =>
                                                                               this.handleCriteriaWeightChange(criteria.CriteriaID.toString(), subCriteria.SubCriteriaID.toString(),
                                                                                   subSubCriteria.SubSubCriteriaID.toString(), e.target.value)}
                                                                       />
                                                                   </div>
                                                               </div>
                                                           </ListItem>
                                                       ))}
                                                </List>
                                               : <ListItem>
                                                       <div className={classes.weightTargetFormContainer}>
                                                           <h4>{subCriteria.Name}</h4>
                                                           <div className="weightTargetForm">
                                                               <TextField
                                                                   label="weight"
                                                                   className="inputField"
                                                                   value={this.getCriteriaValue(criteria.CriteriaID.toString(),
                                                                       subCriteria.SubCriteriaID.toString(), null)}
                                                                   onChange={(e) =>
                                                                       this.handleCriteriaWeightChange(criteria.CriteriaID.toString(),
                                                                           subCriteria.SubCriteriaID.toString(), null, e.target.value)}
                                                               />
                                                           </div>
                                                        </div>
                                                  </ListItem>}
                                           </React.Fragment>
                                       ))}
                                 </List>
                               : <div className={classes.weightTargetFormContainer}>
                                       <h4>{criteria.Name}</h4>
                                       <div className="weightTargetForm">
                                           <TextField
                                               label="Weight"
                                               className="inputField"
                                               value={this.getCriteriaValue(criteria.CriteriaID.toString(), null, null)}
                                               onChange={(e) =>
                                                   this.handleCriteriaWeightChange(criteria.CriteriaID.toString(), null,
                                                   null, e.target.value)}
                                           />
                                       </div>
                                   </div>}
                           </React.Fragment>
                       )
                    })}
                </List>

                <Button
                    variant="outlined"
                    color="success"
                    onClick={this.submitCriteriaWeights}
                >
                    Submit
                </Button>

            </Container>
        );
    }
}

export default withStyles(styles)(AssignCriteria);
