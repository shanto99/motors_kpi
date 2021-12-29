import React from "react";
import { TextField, Button, withStyles } from "@material-ui/core";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { getUserCriteria } from "../../../../API/userManager";
import { setTargets, getTargets } from "../../../../API/target";

import styles from "./style";
import swal from "sweetalert";

class SetTarget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            period: new Date(),
            criterias: [],
            targets: [],
            approved: false
        }


    }

    componentDidMount() {
        Promise.all([getUserCriteria(), getTargets()]).then(responses => {
            const criteria = responses[0] && responses[0].criteria;
            const plan = responses[1].plan;
            const targets = plan && plan.targets || [];

            this.setState({
                criterias: criteria,
                targets: targets || [],
                approved: plan && plan.TargetApprovedBy ? true : false
            });
        });
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

    getCriteriaRemarks = (criteria) => {
        let remarks = '';
        if(criteria.SubSubCriteriaID) {
            remarks = criteria.sub_sub_criteria.Remarks;
        } else if(criteria.SubCriteriaID) {
            remarks = criteria.sub_criteria.Remarks;
        } else {
            remarks = criteria.criteria.Remarks;
        }

        console.log("Remarks: ", remarks);

        return remarks;
    }

    findCriteriaTarget = (criteriaId, subCriteriaId, subSubCriteriaId, targets) => {
        if(!targets) targets = this.state.targets;

        let foundTarget = targets.find(target => {
            return target.CriteriaID == criteriaId && target.SubCriteriaID == subCriteriaId && target.SubSubCriteriaID == subSubCriteriaId;
        });

        return foundTarget;
    }

    getTarget = (criteriaId, subCriteriaId, subSubCriteriaId) => {
        const foundTarget = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId);
        return foundTarget && foundTarget.Target || "";
    }

    handleTargetChange = (criteriaId, subCriteriaId, subSubCriteriaId, target) => {
        this.setState(preState => {
            const newState = {...preState};
            let existingTarget = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId, newState.targets);

            if(existingTarget) existingTarget.Target = target;
            else {
                newState.targets.push({
                    CriteriaID: criteriaId,
                    SubCriteriaID: subCriteriaId,
                    SubSubCriteriaID: subSubCriteriaId,
                    Target: target
                });
            }

            return newState;
        })
    }

    submitTarget = () => {
        if(this.state.approved) return;
        const targets = this.state.targets;
        let period = this.state.period;
        period = `${period.getFullYear()}-${period.getMonth()+1}`;
        setTargets(targets, period).then(res => {
            if(res.status === 200) {
                swal("Submitted", "Targets submitted successfully", "success");
            } else {
                swal("Error", "Could not submit targets", "error");
            }
        });
    }

    handleMonthSelect = (date) => {
        let period = `${date.getFullYear()}-${date.getMonth()+1}`;
        getTargets(period).then(res => {
            const plan = res.plan;
            const targets = plan && plan.targets || [];

            this.setState({
                targets: targets || [],
                approved: plan && plan.TargetApprovedBy ? true : false,
                period: date
            });
        });
        
    }

    render() {
        const classes = this.props.classes;
        const {criterias, approved, period} = this.state;

        return (
            <div className={classes.targetFormContainer}>
                <div className={classes.setTargetHeader}>
                    <h3>Set your target: </h3>
                    <div className="datePickerContainer">
                        <DatePicker selected={period} 
                        dateFormat="yyyy-MM"
                        showMonthYearPicker onChange={this.handleMonthSelect} />
                    </div>
                </div>
                <div style={{ maxHeight: '70vh', overflow: 'auto', padding: '0 20px' }}>
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
                                    disabled={approved}
                                    value={(() => this.getTarget(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID))()}
                                    onChange={(e) => 
                                        this.handleTargetChange(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, e.target.value)}

                                />
                            </div>
                            <div className="remark">
                                <span>{this.getCriteriaRemarks(criteria)}</span>
                            </div>
                        </div>
                    )
                })}
                </div>

                {approved ? <h5>Targets are already approved!</h5> : null}

                <Button
                    variant="outlined"
                    disabled={approved}
                    onClick={this.submitTarget}
                >
                    Submit
                </Button>

            </div>
        )
    }

}

export default withStyles(styles)(SetTarget);

