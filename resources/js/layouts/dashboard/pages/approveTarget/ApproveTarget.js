import React from "react";
import {withStyles} from "@material-ui/core";

import { getPendingTargets, getPlanDetail, approveTargets } from "../../../../API/target";
import { getUserCriteria } from "../../../../API/userManager";

import styles from "./styles";
import swal from "sweetalert";
import { Grid, List, ListItem, ListItemText, TextField, Button } from "@mui/material";

class ApproveTarget extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            selectedPlan: null,
            plans: [],
            selectedPlancriterias: [],
            selectedPlantargets: [],
            planUser: null
        };
    }
    componentDidMount()
    {
        getPendingTargets().then(res => {
            this.setState({
                plans: res.plans || [],
                selectedPlan: null
            });
        }).catch(err => {
            swal("Error", "Could not get plans", "error");
        });
    }

    getMonthName = (index) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[index-1];
    }

    showTargetDetail = (monthPlanId) => {
        const plans = this.state.plans;
        const selectedPlan = plans.find(plan => plan.MonthPlanID === monthPlanId);

        Promise.all([getUserCriteria(selectedPlan.UserID), getPlanDetail(monthPlanId)]).then(responses => {
            const criterias = responses[0].criteria;
            const targets = responses[1].plan && responses[1].plan.targets || [];
            const user = responses[1].plan && responses[1].plan.user || null;

            this.tagetsBackup = JSON.parse(JSON.stringify(targets));

            this.setState({
                selectedPlan: selectedPlan,
                selectedPlancriterias: criterias,
                selectedPlantargets: targets,
                planUser: user
            });
        });
    }

    findCriteriaTarget = (criteriaId, subCriteriaId, subSubCriteriaId, targets) => {
        if(!targets) targets = this.state.selectedPlantargets || [];
        let foundTarget = targets.find(target => {
            return target.CriteriaID == criteriaId && target.SubCriteriaID == subCriteriaId && target.SubSubCriteriaID == subSubCriteriaId;
        });

        return foundTarget;
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

    getTarget = (criteriaId, subCriteriaId, subSubCriteriaId, valueType="Target") => {
        const foundTarget = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId);

        return foundTarget && foundTarget[valueType] || "";
    }

    handleTargetChange = (criteriaId, subCriteriaId, subSubCriteriaId, value, valueType) => {
        this.setState(preState => {
            const newState = {...preState};
            let existingTarget = this.findCriteriaTarget(criteriaId, subCriteriaId, subSubCriteriaId, newState.selectedPlantargets);

            if(existingTarget) existingTarget[valueType] = value;

            return newState;
        })
    }

    checkIfAltered = (target) => {
        let backup = this.tagetsBackup.find(t => t.CriteriaID === target.CriteriaID && t.SubCriteriaID === target.SubCriteriaID && t.SubSubCriteriaID === target.SubSubCriteriaID);
        if(backup) {
            if(Number(backup.Target) !== Number(target.Target) || Number(backup.Weight) !== Number(backup.Weight)) {
                return true;
            }

            return false;
        }
    }

    approveTarget = () => {
        const monthPlanId = this.state.selectedPlan.MonthPlanID;
        const targets = this.state.selectedPlantargets;

        let totalWeight = 0;
        for(let i=0; i<targets.length; i++) {
            const target = targets[i];
            if(this.checkIfAltered(target)) target['ChangedBySupervisor'] = 1;
            else target['ChangedBySupervisor'] = 0;
            if(Number(target.Weight) === 0 && Number(target.Target) !== 0) {
                swal("Error!", "Weight can not be zero while target is non zero", "error");
                return;
            } else if(Number(target.Target) === 0 && Number(target.Weight) !== 0) {
                swal("Error!", "Target can not be zero while weight is non zero", "error");
                return;
            }
            totalWeight += Number(target.Weight);
        }

        if(totalWeight > 99 && totalWeight < 101) totalWeight = 100;

        if(totalWeight !== 100) {
            swal("Error", "Total weight must be 100", "error");
            return;
        }

        approveTargets(monthPlanId, targets).then(res => {
            if(res.status === 200) {
                swal("Approved", "Targets approved successfully", "success");
            } else {
                swal("Error", "Could not approve targets", "error");
            }
        });

    }

    render() {
        const {plans} = this.state;
        const criterias = this.state.selectedPlancriterias;
        const classes = this.props.classes;
        const planUser = this.state.planUser;

        let totalWeight = 0;
        return (
            <Grid container spacing={4}>
                <Grid item lg={4}>
                    <h4>Approve Target</h4>
                    <div style={{maxHeight: '70vh', overflow: 'auto'}}>
                        {plans.map(plan => {
                            let period = plan.Period;
                            let periodArr = period.split("-");
                            let year = periodArr[0];
                            let month = Number(periodArr[1]);
                            return (
                                <div className={classes.targetListItem}>
                                    <h3>{`Target for period: ${this.getMonthName(month)}, ${year}`}</h3>
                                    <p>{`User id: ${plan.UserID}, User name: ${plan.user.UserName}`}</p>
                                    <div className="targetApprovalBtns">
                                        <button className="btnPending">Pending</button>
                                        <button className="btnDetails"  onClick={() => this.showTargetDetail(plan.MonthPlanID)}>See details</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Grid>
                <Grid item lg={8}>
                    {this.state.selectedPlan
                    ? <div className={classes.targetFormContainer}>
                        <div className="userDetails">
                            <h2 style={{margin: '5px 0'}}>{planUser && planUser.UserName}</h2>
                            <h4 style={{margin: '5px 0'}}>User id: {planUser.UserID}</h4>
                            <span><b>Period: {this.state.selectedPlan.Period}</b></span>
                        </div>

                        {criterias.map(criteria => {
                            const weight = this.getTarget(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, 'Weight');
                            totalWeight += Number(weight);
                            return (
                                <div className="formRow">
                                    <div className="fieldLabel">
                                        {this.getCriteriaName(criteria)}
                                    </div>
                                    <div className="fieldInput">
                                        <TextField
                                            variant="outlined"
                                            label="Weight"
                                            value={weight}
                                            onChange={(e) =>
                                                this.handleTargetChange(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, e.target.value, 'Weight')}

                                        />
                                    </div>
                                    <div className="fieldInput">
                                        <TextField
                                            variant="outlined"
                                            label="Target"
                                            value={(() => this.getTarget(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID))()}
                                            onChange={(e) =>
                                                this.handleTargetChange(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, e.target.value, 'Target')}

                                        />
                                    </div>
                                </div>
                            )
                        })}
                        <h4>Total weight: {totalWeight}</h4>
                        <Button
                            variant="outlined"
                            onClick={this.approveTarget}
                        >
                            Approve
                        </Button>
                      </div>
                    : null}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(ApproveTarget);
