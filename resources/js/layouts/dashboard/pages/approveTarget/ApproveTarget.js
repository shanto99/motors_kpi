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
            selectedPlantargets: []
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

            this.setState({
                selectedPlan: selectedPlan,
                selectedPlancriterias: criterias,
                selectedPlantargets: targets
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

    approveTarget = () => {
        const monthPlanId = this.state.selectedPlan.MonthPlanID;
        const targets = this.state.selectedPlantargets;
        let totalWeight = 0;
        targets.forEach(target => {
            totalWeight += Number(target.Weight);
        });
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
        })
        
    }

    render() {
        const {plans} = this.state;
        const criterias = this.state.selectedPlancriterias;
        const classes = this.props.classes;
        return (
            <Grid container spacing={4}>
                <Grid item lg={6}>
                    <List>
                        {plans.map(plan => {
                            let period = plan.Period;
                            let periodArr = period.split("-");
                            let year = periodArr[0];
                            let month = Number(periodArr[1]);
                            return (
                                <ListItem
                                    onClick={() => this.showTargetDetail(plan.MonthPlanID)}
                                >
                                    <ListItemText 
                                    primary={`Plan for period ${this.getMonthName(month-1)}, ${year}`} 
                                    secondary={`User id: ${plan.UserID}, User name: ${plan.user.UserName}`}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
                <Grid item lg={6}>
                    {this.state.selectedPlan 
                    ? <div className={classes.targetFormContainer}>
                        {criterias.map(criteria => {
                            return (
                                <div className="formRow">
                                    <div className="fieldLabel">
                                        {this.getCriteriaName(criteria)}
                                    </div>
                                    <div className="fieldInput">
                                        <TextField
                                            variant="outlined"
                                            label="Weight"
                                            value={(() => this.getTarget(criteria.CriteriaID, criteria.SubCriteriaID, criteria.SubSubCriteriaID, 'Weight'))()}
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