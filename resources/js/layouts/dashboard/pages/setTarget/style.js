const styles = theme => ({
    targetFormContainer: {
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',

        '& .formRow': {
            width: '100%',
            display: 'flex',
            margin: '10px 0',
            '& .fieldLabel': {
                flex: '2',
                display: 'flex',
                alignItems: 'center',
                [theme.breakpoints.down('md')]: {
                    fontSize: '12px'
                }
            },
            '& .fieldInput': {
                flex: '1'
            },
            '& .remark': {
                flex: '1',
                marginLeft: '10px',
                [theme.breakpoints.down('md')]: {
                    fontSize: '12px'
                }
            }
        }
    },

    setTargetHeader: {
        display: 'flex',
        width: '100%',
        maxWidth: '500px',
        justifyContent: 'space-between',
        alignItems: 'center',
        '@media (max-width: 800px)': {
            display: 'block'
        },
        '& .datePickerContainer': {
            width: '100px',
            '& input': {
                height: '40px',
                fontSize: '14px',
                fontWeight: 'bold',
                padding: '5px 8px'
            }
        }
    }
    
});

export default styles;