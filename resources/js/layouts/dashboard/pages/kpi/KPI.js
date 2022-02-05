import React from "react";
import styles from "./style";

import {withStyles} from "@material-ui/core";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {getKpi} from "../../../../API/kpi";

import KPIForm from "../../../../components/kpiForm/KPIForm";

class KPI extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            period: new Date(),
            monthPlanId: null,
            criterias: [],
            approvals: [],
            remarks: [],
            employee: null
        }
    }

    componentDidMount()
    {
        this.fetchKPI();
    }

    fetchKPI = () => {
        let period = `${this.state.period.getFullYear()}-${this.state.period.getMonth()+1}`;
        getKpi(period).then(res => {
            this.setState({
                monthPlanId: res.monthPlanId,
                criterias: res.formattedCriteria,
                approvals: res.approvals,
                employee: res.employee,
                remarks: res.remarks
            });
        }).catch(err => {
            this.setState({
                criterias: [],
                approvals: [],
                employee: null
            });
            console.log("Could not get kpi: ", err);
        });
    }

    handleMonthSelect = (selectedMonth) => {
        this.setState({
            period: selectedMonth
        }, this.fetchKPI);
    }

    render()
    {
        const {period} = this.state;
        const classes = this.props.classes;
        const criterias = JSON.parse(JSON.stringify(this.state.criterias));
         return (
             <div style={{ margin: '0 auto' }}>
                 <div className={classes.kpiFormHeader}>
                    <h3>
                        My KPI for period:
                    </h3>
                    <div className="datePickerContainer">
                        <DatePicker selected={period}
                            dateFormat="yyyy-MM"
                            showMonthYearPicker onChange={this.handleMonthSelect}
                            onChange={this.handleMonthSelect}
                         />
                    </div>
                 </div>
                 {criterias.length < 1
                 ?<React.Fragment>
                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img src="/motors_kpi/images/no_kpi.svg"/>
                    </div>
                    <h2>No KPI found</h2>
                  </React.Fragment>
                 :
                    <KPIForm
                        monthPlanId={this.state.monthPlanId}
                        criterias={criterias}
                        approvals={this.state.approvals}
                        employee={this.state.employee}
                        remarks={this.state.remarks}
                        ref={this.pdfElementRef}
                    />
                 }

             </div>

        )
    }
}

export default withStyles(styles)(KPI);

