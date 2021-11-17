import React from "react";
import swal from "sweetalert";
import {getCriterias} from "../../../../API/criteria";
import {getAllUsers} from "../../../../API/userManager";
import {Autocomplete, Container, FormControl, List, TextField, Button, ListItem} from "@mui/material";
import {Box, ListSubheader} from "@material-ui/core";
import {withStyles} from "@mui/styles";

import {assignWeights, getWeights} from "../../../../API/weight";

import styles from './styles';

class AssignCriteria extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            criterias: [],
            user: null,
            reload: true,
            criteriaWeights: []
        }
    }

    componentDidMount() {
        Promise.all([getAllUsers(), getCriterias()]).then(responses => {
            let users = responses[0].users;
            let criterias = responses[1].criterias;

            this.setState({
                users: users,
                criterias: criterias
            });
        });
    }

    findCriteria = (criteriaId, subCriteriaId, subSubCriteriaId, criteriaWeights) =>
    {
        let criteria = null;

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

    getCriteriaValue = (criteriaId, subCriteria, subSubCriteria, type) => {
        let {criteriaWeights} = this.state;
        let criteria = this.findCriteria(criteriaId, subCriteria, subSubCriteria, criteriaWeights);
        if(type === "weight") {
            return criteria && criteria.Weight || "";
        } else {
            return criteria && criteria.Target || "";
        }

    }

    handleCriteriaWeightChange = (criteriaId, subCriteria, subSubCriteria, inputValue, type) => {
        let {criteriaWeights} = this.state;
        let criteria = this.findCriteria(criteriaId, subCriteria, subSubCriteria, criteriaWeights);
        if(criteria) {
            if(type === 'weight') {
                criteria.Weight = inputValue;
            } else {
                criteria.Target = inputValue;
            }

        } else {
            let criteriaWeight = {
                CriteriaID: criteriaId,
                SubCriteriaID: subCriteria,
                SubSubCriteriaID: subSubCriteria,
                Weight: null,
                Target: null
            }
            if(type === 'weight') {
                criteriaWeight.Weight = inputValue
            } else {
                criteriaWeight.Target = inputValue
            }
            criteriaWeights.push();
        }

        this.setState({
            criteriaWeights
        });
    }

    submitCriteriaWeights = () => {
        const userId = this.state.user.UserID;
        assignWeights(this.state.criteriaWeights, userId).then(res => {
            swal("Assigned", "Criteria assign to user", "success");
            this.setState(preState => {
                const newState = {...preState};
                newState.reload = !preState.reload;
                return newState;
            })
        }).catch(err => {
            swal("Error", "Could not assign criteria", "error");
        })
    }

    handleUserChange = (event, user) => {
        getWeights(user.UserID).then(res => {
            const weight = res.weight;
            if(weight) {
                this.setState({
                    criteriaWeights: weight.weights,
                    user: user
                });
            } else {
                this.setState({
                    criteriaWeights: [],
                    user: user
                });
            }
        });

    }

    render() {
        const {users, criterias} = this.state;
        const {classes} = this.props;
        return (
            <Container maxWidth="md">
                <FormControl style={{ width: '300px' }}>
                    <Autocomplete
                        renderInput={(params) => <TextField {...params} label="User" />}
                        options={users}
                        onChange={this.handleUserChange}
                        getOptionLabel={(option) => option.UserName}
                    />
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
                                                                               subSubCriteria.SubSubCriteriaID.toString(), "weight")}
                                                                           onChange={(e) =>
                                                                               this.handleCriteriaWeightChange(criteria.CriteriaID.toString(), subCriteria.SubCriteriaID.toString(),
                                                                                   subSubCriteria.SubSubCriteriaID.toString(), e.target.value, 'weight')}
                                                                       />
                                                                       <TextField
                                                                           className="inputField"
                                                                           label="Target"
                                                                           value={this.getCriteriaValue(criteria.CriteriaID.toString(),
                                                                               subCriteria.SubCriteriaID.toString(),
                                                                               subSubCriteria.SubSubCriteriaID.toString(), "target")}
                                                                           onChange={(e) =>
                                                                               this.handleCriteriaWeightChange(criteria.CriteriaID.toString(), subCriteria.SubCriteriaID.toString(),
                                                                                   subSubCriteria.SubSubCriteriaID.toString(), e.target.value, 'target')}
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
                                                                       subCriteria.SubCriteriaID.toString(), null, 'weight')}
                                                                   onChange={(e) =>
                                                                       this.handleCriteriaWeightChange(criteria.CriteriaID.toString(),
                                                                           subCriteria.SubCriteriaID.toString(), null, e.target.value, 'weight')}
                                                               />
                                                               <TextField
                                                                   className="inputField"
                                                                   label="Target"
                                                                   value={this.getCriteriaValue(criteria.CriteriaID.toString(),
                                                                       subCriteria.SubCriteriaID.toString(), null, 'target')}
                                                                   onChange={(e) =>
                                                                       this.handleCriteriaWeightChange(criteria.CriteriaID.toString(),
                                                                           subCriteria.SubCriteriaID.toString(), null, e.target.value, 'target')}
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
                                               value={this.getCriteriaValue(criteria.CriteriaID.toString(), null, null, 'weight')}
                                               onChange={(e) =>
                                                   this.handleCriteriaWeightChange(criteria.CriteriaID.toString(), null,
                                                   null, e.target.value, 'weight')}
                                           />
                                           <TextField
                                               className="inputField"
                                               label="Target"
                                               value={this.getCriteriaValue(criteria.CriteriaID.toString(), null, null, 'target')}
                                               onChange={(e) =>
                                                   this.handleCriteriaWeightChange(criteria.CriteriaID.toString(), null,
                                                       null, e.target.value, 'target')}
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
