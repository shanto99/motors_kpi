const styles = theme => ({
    criteriaList: {
        '& h4': {
            margin: '0px',
            marginBottom: '5px'
        },

        '& .MuiListSubheader-sticky': {
            position: 'relative'
        }

    },
    weightTargetFormContainer: {
        marginLeft: '40px',
        '& .weightTargetForm': {
            width: 'auto',
            maxWidth: '600px',
            display: 'flex',
            '& .inputField': {
                flex: 1,
                marginRight: '10px'
            }
        }
    }
});

export default styles;
