import React from "react";
import {withStyles} from "@mui/styles";

import styles from "./styles";
import {Box, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from "@material-ui/core";

class CriteriaForm extends React.Component {
    render() {
        const {classes} = this.props;
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
                                    <TableCell>
                                        Target
                                    </TableCell>
                                    <TableCell>
                                        Actual
                                    </TableCell>
                                    <TableCell>
                                        Weight
                                    </TableCell>
                                    <TableCell>
                                        Score
                                    </TableCell>
                                    <TableCell>
                                        F. Score
                                    </TableCell>
                                    <TableCell>
                                        Remarks
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell rowSpan={5}>
                                        1
                                    </TableCell>
                                    <TableCell rowSpan={5}>
                                        Financial
                                    </TableCell>
                                    <TableCell>
                                        Budget vs. Achievement (Tractor) - Unit
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        %
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Budget vs. Achievement (Tractor) - Unit
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        %
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Budget vs. Achievement (Tractor) - Unit
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        %
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Budget vs. Achievement (Tractor) - Unit
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        10
                                    </TableCell>
                                    <TableCell>
                                        %
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Container>
        );
    }
}

export default withStyles(styles)(CriteriaForm);

