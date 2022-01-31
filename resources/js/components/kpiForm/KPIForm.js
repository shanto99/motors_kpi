import React from "react";
import styles from "./styles";

import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles} from "@material-ui/core";

class KPIForm extends React.Component {
    constructor(props) {
        super(props);

        console.log("Remarks: ", props.remarks);

        this.state = {
            criterias: props.criterias,
            approvals: props.approvals,
            employee: props.employee,
            remarks: props.remarks
        }
    }

    generateCriteriaRows = (criterias) => {
        let mappedCriteria = criterias.map(criteria => {
            if(criteria.sub_criterias && criteria.sub_criterias.length > 0) {
                let subCriterias = criteria.sub_criterias;
                let formattedSubCriterias = [];
                subCriterias.forEach(subCriteria => {
                    let subSubCriterias = subCriteria.sub_sub_criterias;
                    
                    if(subSubCriterias && subSubCriterias.length > 0) {
                        let target = 0;
                        let weight = 0;
                        let actual = 0;

                        subSubCriterias.forEach(subSubCriteria => {
                            if(subSubCriteria.Weight) weight += Number(subSubCriteria.Weight);
                            if(subSubCriteria.Target) target += Number(subSubCriteria.Target);
                            if(subSubCriteria.Actual) actual += Number(subSubCriteria.Actual);
                            
                            formattedSubCriterias.push(subSubCriteria);
                        });

                        let clonedSubCriteria = {...subCriteria};
                        clonedSubCriteria.Target = target.toFixed(2);
                        clonedSubCriteria.Weight = weight.toFixed(2);
                        clonedSubCriteria.Actual = actual.toFixed(2);
                        clonedSubCriteria.isSub = true;

                        formattedSubCriterias.push(clonedSubCriteria);

                    } else {
                        let clonedSubCriteria = {...subCriteria};
                        formattedSubCriterias.push(clonedSubCriteria);
                    }

                    criteria.sub_criterias = formattedSubCriterias;
                });

                return criteria

            } else {
                return criteria;
            }
        });

        return mappedCriteria;
    }

    calculateScore = (criteria) => {
        const target = Number(criteria.Target);
        const actual = Number(criteria.Actual);
        if(target == 0) return 0.00;
        return ((actual/target)*criteria.Weight).toFixed(2);
    }

    calculateFScore = (weight, score) => {
        weight = Number(weight);
        score = Number(score);

        return Math.min(weight, score);
    }

    generateRows = (criterias) => {
        const rowBackgrounds = ['#f5f5f5', '#cfeded', '#e4e1f1'];
        const rows = [];
        let totalWeight = 0;
        let totalScore = 0;
        let totalFScore = 0;

        function getBGcolor(index){
            const colorCount = rowBackgrounds.length;
            const colorIndex = index % colorCount;
            return rowBackgrounds[colorIndex]
        }

        criterias.forEach((criteria, index) => {
            let subCriterias = criteria.sub_criterias;
            if(subCriterias && subCriterias.length > 0) {
                subCriterias.forEach((subCriteria, subIndex) => {
                    const unit = subCriteria.Unit;
                    if(subIndex === 0) {
                        let score = this.calculateScore(subCriteria);
                        let fScore = this.calculateFScore(subCriteria.Weight, score);
                        totalScore += Number(score);
                        totalFScore += Number(fScore);
                        rows.push(
                            <TableRow key={`kpi-row-${index}`} style={{ backgroundColor: getBGcolor(subIndex)}}>
                                <TableCell
                                    className="tableCell"
                                    rowSpan={subCriterias.length}
                                >
                                    {index+1}
                                </TableCell>
                                <TableCell
                                    className="tableCell"
                                    rowSpan={subCriterias.length}
                                >
                                    {criteria.Name}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {subCriteria.Name}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${subCriteria.Target} ${unit}`}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${subCriteria.Actual} ${unit}`}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${subCriteria.Weight} ${unit}`}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${score} ${unit}`}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${fScore} ${unit}`}
                                </TableCell>
                            </TableRow>
                        );
                        totalWeight += Number(subCriteria.Weight);
                    } else {
                        let score = this.calculateScore(subCriteria);
                        let fScore = this.calculateFScore(subCriteria.Weight, score);
                        rows.push(
                            <TableRow
                                className={subCriteria.isSub ? 'coloredRow' : '#fff'}
                                style={{ backgroundColor: getBGcolor(subIndex) }}
                            >
                                <TableCell className="tableCell">
                                    {subCriteria.Name}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${subCriteria.Target} ${unit}`}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${subCriteria.Actual} ${unit}`}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {subCriteria.Weight}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${score} ${unit}`}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {`${fScore} ${unit}`}
                                </TableCell>
                            </TableRow>
                        );

                        if(!subCriteria.isSub) {
                            totalWeight += Number(subCriteria.Weight);
                            totalScore += Number(score);
                            totalFScore += Number(fScore);
                        }
                    }
                });
            } else {
                let unit = criteria.Unit;
                let score = this.calculateScore(criteria);
                let fScore = this.calculateFScore(criteria.Weight, score);
                totalFScore += Number(fScore);
                rows.push(
                    <TableRow>
                        <TableCell className="tableCell">
                            {index+1}
                        </TableCell>
                        <TableCell className="tableCell">
                            {criteria.Name}
                        </TableCell>
                        <TableCell className="tableCell">

                        </TableCell>
                        <TableCell className="tableCell">
                            {`${criteria.Target} ${unit}`}
                        </TableCell>
                        <TableCell className="tableCell">
                            {`${criteria.Actual} ${unit}`}
                        </TableCell>
                        <TableCell className="tableCell">
                            {criteria.Weight}
                        </TableCell>
                        <TableCell className="tableCell">
                            {`${score} ${unit}`}
                        </TableCell>
                        <TableCell className="tableCell">
                            {`${fScore} ${unit}`}
                        </TableCell>
                    </TableRow>
                );
                totalWeight += Number(criteria.Weight);
                totalScore += Number(score);

            }
        });

        rows.push(
            <TableRow>
                <TableCell>

                </TableCell>
                <TableCell>
                    
                </TableCell>
                <TableCell>
                    
                </TableCell>
                <TableCell>
                    
                </TableCell>
                <TableCell>
                    
                </TableCell>
                <TableCell>
                    {totalWeight.toFixed(2)} 
                </TableCell>
                <TableCell>
                    {totalScore.toFixed(2)} 
                </TableCell>
                <TableCell>
                    {totalFScore.toFixed(2)} 
                </TableCell>
            </TableRow>
        );

        return rows;
    }

    static getDerivedStateFromProps(props, state) {
        return{
            criterias: props.criterias,
            approvals: props.approvals,
            employee: props.employee,
            remarks: props.remarks || []
        };
    }


    render()
    {
        const classes = this.props.classes;
        const period = this.props.period || "";
        const {criterias, approvals, employee} = this.state;

        const criteriaRows = this.generateCriteriaRows(criterias);

        const rows = this.generateRows(criteriaRows);

        return (
            <div className={classes.tableContainer}>
                {employee
                ? <div className="employeeInfo">
                    <div className="infoRow">
                        <div>
                            <b>Staff ID: {employee.UserID}</b>
                        </div>
                        <div>
                            <b>Name: {employee.UserName}</b>
                        </div>
                        <div>
                            <b>Period: {period}</b>
                        </div>
                    </div>
                    <div className="infoRow">
                        <div>
                            <b>Phone: {employee.Phone || ""}</b>
                        </div>
                        <div>
                            <b>Portfolio: {employee.Portfolio || ""}</b>
                        </div>
                        <div>
                            <b>Location: {employee.Location || ""}</b>
                        </div>
                    </div>
                </div>
                : null}
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="tableCell">
                                    <b>SL</b>
                                </TableCell>
                                <TableCell className="tableCell">
                                    <b>Criteria</b>
                                </TableCell>
                                <TableCell className="tableCell">
                                    <b>Sub-Criteria</b>
                                </TableCell>
                                <TableCell className="tableCell">
                                    <b>Target</b>
                                </TableCell>
                                <TableCell className="tableCell">
                                    <b>Actual</b>
                                </TableCell>
                                <TableCell className="tableCell">
                                    <b>Weight</b>
                                </TableCell>
                                <TableCell className="tableCell">
                                    <b>Score</b>
                                </TableCell>
                                <TableCell className="tableCell">
                                    <b>F. Score</b>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className={classes.signaturesPanel}>
                    {this.state.employee
                    ? <div className="signatureContainer">
                        <img src={`/motors_kpi/${this.state.employee.Signature}`} />
                        Name: {this.state.employee.UserName}
                        <h3>Employee</h3>
                      </div>
                    : null}
                    
                    {approvals.map(approval => {
                        const user = approval.user;
                        return (
                            <div key={`kpi-sign-${user.UserID}`} className="signatureContainer">
                                <img src={`/motors_kpi/${user.Signature}`} />
                                Name: {user.UserName}
                                <h3>{user.designation.Designation}</h3>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <h4>Remarks:</h4>
                    {this.state.remarks.map((remark, index) => {
                        return (
                            <div key={`kpi-remarks-${index}`}>{remark.Remarks}</div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(KPIForm);

