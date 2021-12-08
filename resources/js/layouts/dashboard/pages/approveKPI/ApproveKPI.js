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
            planDetails: null,
            approvals: []
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
            this.setState({
                selectedPlanId: planId,
                planDetails: res.formattedCriteria,
                approvals: res.approvals || []
            });
        }).catch(err => {
            swal('Error', "Could not fetch KPI", "error");
        })
    }

    approveKpi = () => {
        const {selectedPlanId} = this.state;
        approveKpi(selectedPlanId).then(res => {
            swal("Approved", "KPI approved successfully", "success");
        }).catch(err => {
            swal("Error", "Could not approve KPI", "error");
        });
    }

    render() {
        const {plans, selectedPlanId, planDetails} = this.state;
        const classes = this.props.classes;
        return (
            <Grid container>
                <Grid item lg={4} md={4}>
                    <List>
                        {plans.map(plan => {
                            let period = plan.Period;
                            let periodArr = period.split("-");
                            let year = periodArr[0];
                            let month = Number(periodArr[1]);
                            return (
                                <ListItem
                                    onClick={() => this.showKPI(plan.MonthPlanID)}
                                >
                                    <ListItemText 
                                    primary={`Plan for period: ${this.getMonthName(month-1)}, ${year}`} 
                                    secondary={`User id: ${plan.UserID}, User name: ${plan.user.UserName}`}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
                <Grid item lg={8} md={8}>
                    {planDetails
                    ? <div>
                        <KPIForm criterias={this.state.planDetails} approvals={this.state.approvals} />
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