const styles = theme => ({
    tableContainer: {
        width: '100%',
        maxWidth: '1000px',

        '& .tableCell': {
            border: '1px solid'
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
            }
        }
    },

    signaturesPanel: {
        display: 'flex',
        width: '100%',
        marginTop: '20px',

        '& .signatureContainer': {
            width: '120px',
            '& img': {
                width: '100px'
            }
        }
    },
});

export default styles;