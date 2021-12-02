import React from "react";
import { TextField, Button, withStyles } from "@material-ui/core";

import { getUserCriteria } from "../../../../API/userManager";
import { setTargets } from "../../../../API/target";

import styles from "./style";

class SetTarget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            criterias: [],
            targets: []
        }


    }

    componentDidMount() {
        getUserCriteria().then(res => {
            this.setState({
                criterias: res.criteria
            });
        })
    }

    getCriteriaName = (criteria) => {
        let testName = '';
        if(criteria.SubSubCriteriaID) {
            testName = criteria.sub_sub_criteria.Name;
        } else if(criteria.SubCriteriaID) {
            testName = criteria.sub_criteria.Name;
        } else {
            testName = criteria.criteria.Name;
        }

        return testName;
    }

    findCriteriaTarget = (criteriaId, subCriteriaId, subSubCriteriaId, targets) => {
        if(!targets) targets = this.state.targets;

        let foundTarget = targets.find(target => {
            if(subSubCriteriaId) {
                return subSubCriteriaId === target.subSubCriteriaId;
            } else if(subCriteriaId) {
                return subCriteriaId === target.subCriteriaId;
            } else {
                return criteriaId === target.criteriaId;
            }
        });

        return foundTarget;
    }

    getTarget = (criteriaId, subCriteriaId, subSubCriteriaId) => {
        const foundTarget = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId);
        return foundTarget && foundTarget.target || "";
    }

    handleTargetChange = (criteriaId, subCriteriaId, subSubCriteriaId, target) => {
        this.setState(preState => {
            const newState = {...preState};
            let existingTarget = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId, newState.targets);

            if(existingTarget) existingTarget.target = target;
            else {
                newState.targets.push({
                    criteriaId: criteriaId,
                    subCriteriaId: subCriteriaId,
                    subSubCriteriaId: subSubCriteriaId,
                    target: target
                });
            }

            return newState;
        })
    }

    submitTarget = () => {
        const targets = this.state.targets;
        setTargets(targets).then(res => {
            console.log(res);
        })
    }

    render() {
        const classes = this.props.classes;
        const {criterias} = this.state;

        return (
            <div className={classes.targetFormContainer}>
                <h3>Set your target: </h3>
                {criterias.map(criteria => {
                    return (
                        <div className="formRow">
                            <div className="fieldLabel">
                                {this.getCriteriaName(criteria)}
                            </div>
                            <div className="fieldInput">
                                <TextField
                                    variant="outlined"
                                    label="Target"
                                    value={(() => this.getTarget(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID))()}
                                    onChange={(e) => 
                                        this.handleTargetChange(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, e.target.value)}

                                />
                            </div>
                        </div>
                    )
                })}

                <Button
                    variant="outlined"
                    onClick={this.submitTarget}
                >
                    Submit
                </Button>

            </div>
        )
    }

}

export default withStyles(styles)(SetTarget);

