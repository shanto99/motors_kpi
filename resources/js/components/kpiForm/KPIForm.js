import React from "react";
import styles from "./styles";

import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles} from "@material-ui/core";

class KPIForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criterias: props.criterias,
            approvals: props.approvals,
            employee: props.employee
        }
    }

    generateCriteriaRows = (criterias) => {
        let mappedCriteria = criterias.map(criteria => {
            if(criteria.sub_criterias && criteria.sub_criterias.length > 0) {
                let subCriterias = criteria.sub_criterias;

                subCriterias.forEach(subCriteria => {
                    let subSubCriterias = subCriteria.sub_sub_criterias;
                    let formattedSubCriterias = [];
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
                        clonedSubCriteria.Target = target;
                        clonedSubCriteria.Weight = weight;
                        clonedSubCriteria.Actual = actual;
                        clonedSubCriteria.isSub = true;

                        formattedSubCriterias.push(clonedSubCriteria);

                        criteria.sub_criterias = formattedSubCriterias;

                    }
                });

                return criteria

            } else {
                return criteria;
            }
        });

        return mappedCriteria;
    }

    generateRows = (criterias) => {
        const rows = [];
        criterias.forEach((criteria, index) => {
            let subCriterias = criteria.sub_criterias;
            if(subCriterias && subCriterias.length > 0) {
                subCriterias.forEach((subCriteria, subIndex) => {
                    if(subIndex === 0) {
                        rows.push(
                            <TableRow>
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
                                    {subCriteria.Target}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {subCriteria.Actual}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {subCriteria.Weight}
                                </TableCell>
                            </TableRow>
                        )
                    } else {
                        rows.push(
                            <TableRow
                                className={subCriteria.isSub ? 'coloredRow' : ''}
                            >
                                <TableCell className="tableCell">
                                    {subCriteria.Name}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {subCriteria.Target}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {subCriteria.Actual}
                                </TableCell>
                                <TableCell className="tableCell">
                                    {subCriteria.Weight}
                                </TableCell>
                            </TableRow>
                        )
                    }
                });
            } else {
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
                            {criteria.Target}
                        </TableCell>
                        <TableCell className="tableCell">
                            {criteria.Actual}
                        </TableCell>
                        <TableCell className="tableCell">
                            {criteria.Weight}
                        </TableCell>
                    </TableRow>
                )
            }
        });

        return rows;
    }

    static getDerivedStateFromProps(props, state) {
        return{
            criterias: props.criterias,
            approvals: props.approvals,
            employee: props.employee
        };
    }

    render()
    {
        const classes = this.props.classes;
        const {criterias, approvals, employee} = this.state;

        const criteriaRows = this.generateCriteriaRows(criterias);

        const rows = this.generateRows(criteriaRows);

        return (
            <div className={classes.tableContainer}>
                {employee
                ? <div className="employeeInfo">
                    <div className="infoRow">
                        <div>Staff ID: {employee.UserID}</div>
                        <div>
                            Name: {employee.UserName}
                        </div>
                    </div>
                </div>
                : null}
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="tableCell">
                                    SL
                                </TableCell>
                                <TableCell className="tableCell">
                                    Criteria
                                </TableCell>
                                <TableCell className="tableCell">
                                    Sub-Criteria
                                </TableCell>
                                <TableCell className="tableCell">
                                    Target
                                </TableCell>
                                <TableCell className="tableCell">
                                    Actual
                                </TableCell>
                                <TableCell className="tableCell">
                                    Weight
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
                        <img src={`/${this.state.employee.Signature}`} />
                        Name: {this.state.employee.UserName}
                        <h3>Employee</h3>
                      </div>
                      : null}
                    
                    {approvals.map(approval => {
                        const user = approval.user;
                        return (
                            <div className="signatureContainer">
                                <img src={`/${user.Signature}`} />
                                Name: {user.UserName}
                                <h3>{user.designation.Designation}</h3>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(KPIForm);

