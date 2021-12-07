import React from "react";
import styles from "./style";

import {withStyles} from "@material-ui/core";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {getKpi} from "../../../../API/kpi";

import KPIForm from "../../../../components/kpiForm/KPIForm";
import { ClassNames } from "@emotion/react";

class KPI extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            period: new Date(),
            criterias: []
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
                criterias: res
            });
        }).catch(err => {
            this.setState({
                criterias: []
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
         return (
             <React.Fragment>
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
                 <KPIForm criterias={this.state.criterias}/>
             </React.Fragment>
            
        )
    }
}

export default withStyles(styles)(KPI);

