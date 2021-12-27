const styles = theme => ({
    targetFormContainer: {
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',

        '& .formRow': {
            width: '100%',
            display: 'flex',
            margin: '10px 0',
            '& .fieldInput:not(:last-child)': {
                marginRight: '10px'
            },
            '& .fieldLabel': {
                flex: '5',
                display: 'flex',
                alignItems: 'center'
            },
            '& .fieldInput': {
                flex: '2'
            }
        },

        '& .userDetails': {
            textAlign: 'center'
        }
    },
    targetListItem: {
        width: 'fit-content',
        '& .targetApprovalBtns': {
            display: 'flex',
            justifyContent: 'space-between'
        },
        '& h3, & p': {
            margin: '5px 0 !important'
        },
        '& .btnPending': {
            color: 'white',
            backgroundColor: 'orange',
            padding: '8px 15px',
            fontSize: '15px',
            border: 'none',
        },
        '& .btnDetails': {
            fontSize: '15px',
            border: 'none',
            background: 'none',
            color: 'green',
            cursor: 'pointer'
        }
    }
});

export default styles;