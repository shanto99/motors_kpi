import React from "react";

import {getSubordinats} from "../../../../API/userManager";
import {getUserKpiByPeriod} from "../../../../API/kpi";
import { Select, FormControl, InputLabel, MenuItem, withStyles, TextField } from "@material-ui/core";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import KPIForm from "../../../../components/kpiForm/KPIForm";
import { Autocomplete } from "@material-ui/lab";

import styles from "./styles";

class Home extends React.Component {
    constructor(props)
    {
        super(props);

        let dateInstance = new Date();

        let period = `${dateInstance.getFullYear()}-${dateInstance.getMonth()+1}`;

        this.state = {
            selectedDateInstance: new Date(),
            selectedUserId: null,
            selectedPeriod: period,
            subordinates: [],
            kpi: null
        }
    }

    componentDidMount()
    {
        getSubordinats().then(res => {
            const subordinates = res.subordinates;
            this.setState({
                subordinates: subordinates
            })
        });
    }

    getKpi = () => {
        let {selectedUserId, selectedPeriod} = this.state;
        if(selectedUserId && selectedPeriod) {
            getUserKpiByPeriod(selectedUserId, selectedPeriod).then(res => {
                this.setState({
                    kpi: res
                });
            });
        }
    }

    handleSubordinateSelect = (user) => {
        let userId = user.UserID;
        this.setState({
            selectedUserId: userId
        }, this.getKpi);
    }

    handleMonthSelect = (periodDateInstance) => {
        let period = `${periodDateInstance.getFullYear()}-${periodDateInstance.getMonth()+1}`;
        this.setState({
            selectedPeriod: period,
            selectedDateInstance: periodDateInstance
        }, this.getKpi);
    }

    render() {
        const classes = this.props.classes;
        const subordinates = this.state.subordinates;
        const period = this.state.selectedPeriod;

        const kpi = this.state.kpi ? JSON.parse(JSON.stringify(this.state.kpi)) : null;

        return (
            <React.Fragment>
                <div className={classes.kpiSearchForm}>
                    <div className="autoCompleteContainer">
                        <label style={{ fontWeight: 'bold', marginRight: '20px' }}>Select Subordinate: </label>
                        <Autocomplete
                            style={{width: '250px'}}
                            options={subordinates}
                            getOptionLabel={(option) => option.UserName}
                            renderOption={(option, props) => {
                                if(option.IsDirectSubordinate) {
                                    return (<span style={{ fontWeight: 'bold' }}>{option.UserName}</span>);
                                } else {
                                    return (<span>{option.UserName}</span>)
                                }
                                
                            }}
                            onChange={(e, user) => this.handleSubordinateSelect(user)}
                            renderInput={(params) => <TextField variant="outlined" {...params} label="Subordinate" /> }
                        />
                    </div>
                    

                    <div className={classes.datePickerContainer}>
                        <label style={{ fontWeight: 'bold', width: '150px' }}>Select Period</label>
                        <DatePicker selected={this.state.selectedDateInstance} 
                        dateFormat="yyyy-MM"
                        showMonthYearPicker onChange={this.handleMonthSelect} />
                    </div>
                </div>
                {kpi
                ? <div style={{ margin: '0 auto', marginTop: '30px' }}>
                    <KPIForm 
                        monthPlanId = {kpi.MonthPlanID}
                        period={period}
                        criterias={kpi.formattedCriteria} 
                        approvals={kpi.approvals}
                        employee={kpi.employee}
                        remarks={kpi.remarks}
                    />
                  </div>
                : <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src="/motors_kpi/images/no_kpi.svg"/>
                 </div>}
            </React.Fragment>
            
        );
    }
}

export default withStyles(styles)(Home);
