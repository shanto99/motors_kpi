import React from "react";
import {withStyles} from "@mui/styles";

import styles from "./styles";
import {Box, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from "@material-ui/core";

import {getSubmittedCriteriaDetails} from "../../../../API/criteria";

class CriteriaForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criterias: {}
        }
    }

    componentDidMount() {
        getSubmittedCriteriaDetails().then(res => {
            this.setState({
               criterias: res.result
            });
        })
    }


    calculateRowSpan = (row) => {

    }

    render() {
        const {classes} = this.props;
        const {criterias} = this.state;
        return (
            <Container>
                <Box className={classes.formContainer}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        SL
                                    </TableCell>
                                    <TableCell>
                                        Criteria
                                    </TableCell>
                                    <TableCell>
                                        Sub-Criteria
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(criterias).map((criteriaKey, index) => {
                                    const criteria = criterias[criteriaKey];
                                    return (
                                        <React.Fragment>
                                            <TableRow>
                                                <TableCell rowSpan={this.calculateRowSpan(criteria)}>

                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        );
    }
}

export default withStyles(styles)(CriteriaForm);

