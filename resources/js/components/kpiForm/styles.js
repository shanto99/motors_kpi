const styles = theme => ({
    tableContainer: {
        width: 'fit-content',
        maxHeight: '70vh',
        overflow: 'auto',
        margin: '0 auto',

        [theme.breakpoints.down('md')]: {
            width: '100% !important'
        },

        '& .tableCell': {
            border: '2px solid white',
            '@media (max-width: 800px)': {
                fontSize: '12px'
            },
        },

        '& .coloredRow': {
            backgroundColor: 'yellow',

            '& .tableCell': {
                fontWeight: 'bold'
            }
        },
        '& .infoRow': {
            display: 'flex',
            '& div': {
                flex: 1
            },
            '@media (max-width: 800px)': {
                fontSize: '10px'
            },
        }
    },

    signaturesPanel: {
        display: 'flex',
        width: '100%',
        marginTop: '20px',
        '@media (max-width: 800px)': {
            fontSize: '12px'
        },

        '& .signatureContainer': {
            width: '120px',
            '& img': {
                width: '100px'
            }
        }
    },
});

export default styles;