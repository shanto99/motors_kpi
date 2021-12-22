import React from "react";

import {getSubordinats} from "../../../../API/userManager";
import {getUserKpiByPeriod} from "../../../../API/kpi";
import { Select, FormControl, InputLabel, MenuItem, withStyles } from "@material-ui/core";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import KPIForm from "../../../../components/kpiForm/KPIForm";

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

    handleSubordinateSelect = (event, user) => {
        let userId = event.target.value
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
                <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px', flex: '1' }}>
                        <label style={{ fontWeight: 'bold', marginRight: '20px' }}>Select Subordinate: </label>
                        <FormControl style={{width: '200px'}}>
                            <InputLabel id="subordinate-select-label">Select subordinate</InputLabel>
                            <Select
                                labelId="subordinate-select-label"
                                variant="outlined"
                                id="subordinate-select"
                                label="Select subordinate"
                                onChange={this.handleSubordinateSelect}
                            >
                                {subordinates.map(subordinate => {
                                    return (
                                        <MenuItem value={subordinate.UserID}>{subordinate.UserName}</MenuItem>
                                    )
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    

                    <div className={classes.datePickerContainer} 
                    style={{ display: 'flex', alignItems: 'center', marginRight: '20px', flex: '1' }}>
                        <label style={{ fontWeight: 'bold', width: '150px' }}>Select Period</label>
                        <DatePicker selected={this.state.selectedDateInstance} 
                        dateFormat="yyyy-MM"
                        showMonthYearPicker onChange={this.handleMonthSelect} />
                    </div>
                </div>
                {kpi
                ? <div style={{ width: 'fit-content', margin: '0 auto', marginTop: '30px' }}>
                    <KPIForm 
                        period={period}
                        criterias={kpi.formattedCriteria} 
                        approvals={kpi.approvals}
                        employee={kpi.employee}
                    />
                  </div>
                : <div>No KPI found</div>}
            </React.Fragment>
            
        );
    }
}

export default withStyles(styles)(Home);
