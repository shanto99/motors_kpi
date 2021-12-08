import React from "react";
import { TextField, Button, withStyles } from "@material-ui/core";

import { getUserCriteria } from "../../../../API/userManager";
import { inputActuals, getTargets } from "../../../../API/target";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import styles from "./style";
import swal from "sweetalert";

class ActualInput extends React.Component {

    constructor(props) {
        super(props);

        let today = new Date();
        let lastMonth = today.setDate(0);

        this.state = {
            selectedPlanId: null,
            criterias: [],
            targets: [],
            targetApproved: false,
            period: lastMonth,
            actualApproved: true
        }


    }

    componentDidMount() {
        const lastMonthDate = new Date().setDate(0);
        const lastMonth = new Date(lastMonthDate);
        const period = lastMonth.getFullYear()+"-"+(lastMonth.getMonth()+1);

        Promise.all([getUserCriteria(), getTargets(period)]).then(responses => {
            const criteria = responses[0] && responses[0].criteria;
            const plan = responses[1].plan;
            const targets = plan && plan.targets || [];

            this.setState({
                selectedPlanId: plan.MonthPlanID,
                criterias: criteria,
                targets: targets || [],
                targetApproved: plan && plan.TargetApprovedBy ? true : false,
                actualApproved: plan.approvals && plan.approvals.length > 0 ? true : false
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

    findCriteriaTarget = (criteriaId, subCriteriaId, subSubCriteriaId, targets) => {
        if(!targets) targets = this.state.targets;

        let foundTarget = targets.find(target => {
            return target.CriteriaID == criteriaId && target.SubCriteriaID == subCriteriaId && target.SubSubCriteriaID == subSubCriteriaId;
        });

        return foundTarget;
    }

    getTarget = (criteriaId, subCriteriaId, subSubCriteriaId, valueType="target") => {
        const foundTarget = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId);
        if(valueType === "target") return foundTarget && foundTarget.Target || "";
        else return foundTarget && foundTarget.Actual || "";
    }

    handleTargetChange = (criteriaId, subCriteriaId, subSubCriteriaId, value) => {
        this.setState(preState => {
            const newState = {...preState};
            let target = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId, newState.targets);

            if(target) {
                target.Actual = value;
            }

            return newState;
        })
    }

    submitTarget = () => {
        const planId = this.state.selectedPlanId;
        const targets = this.state.targets;

        inputActuals(targets, planId).then(res => {
            if(res.status === 200) {
                swal("Submitted", "Actual submitted successfully", "success");
            }
        }).catch(err => {
            swal("Opps!", "Could not submit actuals", "error");
        });
    }

    handleMonthSelect = (date) => {
        let period = `${date.getFullYear()}-${date.getMonth()+1}`;
        getTargets(period).then(res => {
            const plan = res.plan;
            if(plan) {
                const targets = plan.targets || [];
                const approved = !!(plan.TargetApprovedBy);

                this.setState({
                    selectedPlanId: plan.MonthPlanID,
                    targets: targets || [],
                    targetApproved: approved,
                    period: date,
                    actualApproved: plan.approvals && plan.approvals.length > 0 ? true : false
                });
            }
            
        });
    }

    render() {
        const classes = this.props.classes;
        const {criterias, targetApproved, period, actualApproved} = this.state;

        return (
            <div className={classes.targetFormContainer}>
                <div className={classes.inputActualHeader}>
                    <h3>Input actuals: </h3>
                    <div className="datePickerContainer">
                        <DatePicker selected={period} 
                        dateFormat="yyyy-MM"
                        showMonthYearPicker onChange={this.handleMonthSelect} />
                    </div>
                </div>

                
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
                                    disabled={true}
                                    value={(() => this.getTarget(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID))()}
                                    onChange={(e) => 
                                        this.handleTargetChange(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, e.target.value)}

                                />
                            </div>
                            <div className="fieldInput">
                                <TextField
                                    variant="outlined"
                                    label="Actual"
                                    disabled={!(targetApproved && !actualApproved)}
                                    value={(() => this.getTarget(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, "actual"))()}
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
                    disabled={!(targetApproved && !actualApproved)}
                >
                    Submit
                </Button>

            </div>
        )
    }

}

export default withStyles(styles)(ActualInput);
