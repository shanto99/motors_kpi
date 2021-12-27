import React from "react";
import {Grid, List, ListItem, ListItemText, Button, withStyles} from "@material-ui/core";
import KPIForm from "../../../../components/kpiForm/KPIForm";

import { getPendingKpis } from "../../../../API/target";
import { getKpiById, approveKpi } from "../../../../API/kpi";

import styles from "./styles";
import swal from "sweetalert";

class ApproveKPI extends React.Component {
    constructor(props)
    {
        super(props);

        this.state = {
            plans: [],
            selectedPlanId: null,
            selectedPlan: null,
            planDetails: null,
            approvals: [],
            employee: null
        }
    }
    componentDidMount()
    {
        getPendingKpis().then(res => {
            this.setState({
                plans: res.plans || []
            });
        }).catch(err => {

        });
    }

    getMonthName = (index) => {
        const months = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[index-1];
    }

    showKPI = (planId) => {
        getKpiById(planId).then(res => {
            const selectedPlan = this.state.plans.find(plan => plan.MonthPlanID === planId);
            this.setState({
                selectedPlanId: planId,
                selectedPlan: selectedPlan,
                planDetails: res.formattedCriteria,
                approvals: res.approvals || [],
                employee: res.employee
            });
        }).catch(err => {
            swal('Error', "Could not fetch KPI", "error");
        })
    }

    approveKpi = () => {
        const {selectedPlanId} = this.state;
        swal({
            text: 'Give a comment(optional)',
            content: "input",
            button: {
                text: "Approve",
                closeModal: false
            }
        }).then(comment => {
            comment = comment === "" ? null : comment;
            approveKpi(selectedPlanId, comment).then(res => {
                swal("Approved", "KPI approved successfully", "success");
                this.setState(preState => {
                    const newState = {...preState};
                    let plans = newState.plans;
                    const selectedPlanId = this.state.selectedPlanId;

                    plans = plans.filter(function(plan) {
                        return plan.MonthPlanID !== selectedPlanId;
                    });

                    newState.plans = plans;
                    newState.selectedPlanId = null;
                    newState.selectedPlan = null;
                    newState.planDetails = null;
                    newState.employee = null;
                    return newState;
                });
            }).catch(err => {
                swal("Error", "Could not approve KPI", "error");
            });
        });
    }

    render() {
        const {plans, selectedPlanId, planDetails} = this.state;
        const classes = this.props.classes;

        return (
            <Grid container>
                <Grid item lg={4} md={4}>
                    <h3>Approve KPI</h3>
                    <div style={{maxWidth: '74vh', overflow: 'auto'}}>
                        {plans.map(plan => {
                            let period = plan.Period;
                            let periodArr = period.split("-");
                            let year = periodArr[0];
                            let month = Number(periodArr[1]);
                            return (
                                <div className={classes.kpiListItem}>
                                    <h3>{`Plan for period: ${this.getMonthName(month)}, ${year}`}</h3>
                                    <p>{`User id: ${plan.UserID}, User name: ${plan.user.UserName}`}</p>
                                    <div className="kpiApprovalBtns">
                                        <button className="btnPending">Pending</button>
                                        <button className="btnDetails"  onClick={() => this.showKPI(plan.MonthPlanID)}>See details</button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Grid>
                <Grid item lg={8} md={8}>
                    {planDetails
                    ? <div>
                        <div style={{ maxHeight: '74vh', overflow: 'auto' }}>
                          <KPIForm criterias={this.state.planDetails} 
                            employee = {this.state.employee}
                            period={this.state.selectedPlan.Period}
                            approvals={this.state.approvals} />  
                        </div>
                        
                        <div className={classes.kpiFormFooter}>
                            <Button
                                variant="outlined"
                                onClick={this.approveKpi}
                            >
                                Approve
                            </Button>
                        </div>
                      </div>
                    : null}
                    
                </Grid>
            </Grid>
        )
    }

}

export default withStyles(styles)(ApproveKPI);