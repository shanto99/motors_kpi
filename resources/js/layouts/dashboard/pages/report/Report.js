import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, withStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {getReport} from "../../../../API/kpi";
import {getSubordinats} from "../../../../API/userManager";

import styles from "./style.js";
import { SignalWifiStatusbarConnectedNoInternet4Sharp } from "@mui/icons-material";
import swal from "sweetalert";

class Report extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            subordinates: [],
            periods: [],
            selectedSubordinate: null,
            fromDate: new Date(),
            toDate: new Date()
        }
    }

    componentDidMount()
    {
        getSubordinats().then(res => {
            const subordinates = res.subordinates || [];
            this.setState({
                subordinates: subordinates
            })
        });
    }

    handleSubordinateSelect = (user) => {
        this.setState({
            selectedSubordinate: user
        });
    }

    handleFromPeriodChange = (date) => {
        this.setState({
            fromDate: date
        });
    }

    handleToPeriodChange = (date) => {
        this.setState({
            toDate: date
        });
    }

    getReport = () => {
        const {fromDate, toDate, selectedSubordinate} = this.state;
        if(!selectedSubordinate) {
            swal("Error!", "Select a user", "error");
            return;
        }
        let fromDateString = `${fromDate.getFullYear()}-${fromDate.getMonth()+1}-01`;
        let toDateString = `${toDate.getFullYear()}-${toDate.getMonth()+1}-01`;
        let userId = selectedSubordinate.UserID;

        getReport(userId, fromDateString, toDateString).then(res => {
            this.setState({
                periods: res.periods || []
            });
        }).catch(err => {
            swal("Error!", "Could not get report", "error");
        })
    }
    render()
    {
        const {subordinates, periods} = this.state;
        const classes = this.props.classes;
        return (
            <div>
                <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', marginBottom: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{marginRight: '20px', marginBottom: '20px', flex: '1' }}>
                        <label style={{ fontWeight: 'bold', marginRight: '20px' }}>Select Subordinate: </label>
                        <Autocomplete
                            style={{width: '250px'}}
                            options={subordinates}
                            getOptionLabel={(option) => option.UserName}
                            onChange={(e, user) => this.handleSubordinateSelect(user)}
                            renderInput={(params) => <TextField variant="outlined" {...params} label="Subordinate" /> }
                        />
                    </div>

                    <div className={classes.datePickerContainer} 
                    style={{ marginRight: '20px', marginBottom: '20px', flex: '1' }}>
                        <label style={{ fontWeight: 'bold', width: '150px' }}>Select Period</label>
                        <DatePicker selected={this.state.fromDate} 
                        dateFormat="yyyy-MM"
                        showMonthYearPicker onChange={this.handleFromPeriodChange} />
                    </div>

                    <div className={classes.datePickerContainer} 
                    style={{ marginRight: '20px', marginBottom: '20px', flex: '1' }}>
                        <label style={{ fontWeight: 'bold', width: '150px' }}>Select Period</label>
                        <DatePicker selected={this.state.toDate} 
                        dateFormat="yyyy-MM"
                        showMonthYearPicker onChange={this.handleToPeriodChange} />
                    </div>

                    <button style={{ height: '50px', padding: '0 20px', backgroundColor: 'orange', border: 'none', color: 'white' }} onClick={this.getReport}>Report</button>
                </div>
                <div style={{width: '100%', maxWidth: '500px', margin: '0 auto'}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <b>Period</b>
                                    </TableCell>
                                    <TableCell>
                                        <b>Score</b>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {periods.map(period => (
                                    <TableRow>
                                        <TableCell>
                                            {period.period}
                                        </TableCell>
                                        <TableCell>
                                            {period.score}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Report);