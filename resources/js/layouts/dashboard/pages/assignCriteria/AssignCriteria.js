import React from "react";
import {getCriterias} from "../../../../API/criteria";
import {getAllUsers} from "../../../../API/userManager";
import {Autocomplete, Container, FormControl, List, TextField, Button} from "@mui/material";
import {Box, ListSubheader} from "@material-ui/core";

import {assignWeights} from "../../../../API/weight";

class AssignCriteria extends React.Component {
    constructor(props) {
        super(props);
        this.criteriaWeights = [];
        this.state = {
            users: [],
            criterias: [],
            user: null
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

    handleCriteriaWeightChange = (criteriaId, subCriteria, subSubCriteria, inputWeight) => {
        let criteria = null;
        if(subSubCriteria) {
            criteria = this.criteriaWeights.find(weight => weight.criteriaId === criteriaId && weight.subCriteria === subCriteria && weight.subSubCriteria === subSubCriteria);
        }else if(subSubCriteria) {
            criteria = this.criteriaWeights.find(weight => weight.criteriaId === criteriaId && weight.subCriteria === subCriteria);
        } else if(criteriaId) {
            criteria = this.criteriaWeights.find(weight => weight.criteriaId === criteriaId);
        }
        if(criteria) {
            criteria.weight = inputWeight;
        } else {
            this.criteriaWeights.push({
                criteriaId,
                subCriteria,
                subSubCriteria,
                inputWeight
            });
        }

    }

    submitCriteriaWeights = () => {
        assignWeights(this.criteriaWeights).then(res => {
            console.log(res);
        }).catch(err => {
            console.log("Could not save weights: ", err);
        })
    }

    render() {
        const {users, criterias} = this.state;
        return (
            <Container maxWidth="md">
                <FormControl style={{ width: '300px' }}>
                    <Autocomplete
                        renderInput={(params) => <TextField {...params} label="User" />}
                        options={users}
                        getOptionLabel={(option) => option.UserName}
                    />
                </FormControl>

                <List
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            Criteria
                        </ListSubheader>
                    }
                >
                    {criterias.map(criteria => {
                       return (
                           <React.Fragment>
                               {criteria.sub_criterias
                               ? <List
                                       style={{ paddingLeft: '40px' }}
                                       subheader={
                                           <ListSubheader component="div" id="nested-list-subheader">
                                               {criteria.Name}
                                           </ListSubheader>
                                       }
                                   >
                                       {criteria.sub_criterias.map(subCriteria => (
                                           <React.Fragment>
                                               {subCriteria.sub_sub_criterias
                                               ? <List
                                                       style={{ paddingLeft: '40px' }}
                                                       subheader={
                                                           <ListSubheader component="div" id="nested-list-subheader">
                                                               {subCriteria.Name}
                                                           </ListSubheader>
                                                       }
                                                   >
                                                       {subCriteria.sub_sub_criterias.map(subSubCriteria => (
                                                           <TextField
                                                               label={subSubCriteria.Name}
                                                               onChange={(e) => this.handleCriteriaWeightChange(criteria.CriteriaID, subCriteria.SubCriteriaID, subSubCriteria.SubSubCriteriaID, e.target.value)}
                                                           />
                                                       ))}
                                                </List>
                                               : <TextField
                                                       label={subCriteria.Name}
                                                       onChange={(e) => this.handleCriteriaWeightChange(criteria.CriteriaID, subCriteria.SubCriteriaID, null, e.target.value)}
                                                   />}
                                           </React.Fragment>
                                       ))}
                                 </List>
                               : <TextField
                                   label={criteria.Name}
                                   onChange={(e) => this.handleCriteriaWeightChange(criteria.CriteriaID, null, null, e.target.value)}
                                 />}
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

export default AssignCriteria;
