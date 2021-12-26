const styles = theme => ({
    kpiFormFooter: {
        width: '100%',
        marginTop: '20px',
        display: 'flex'
    },
    kpiListItem: {
        width: 'fit-content',
        '& .kpiApprovalBtns': {
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
