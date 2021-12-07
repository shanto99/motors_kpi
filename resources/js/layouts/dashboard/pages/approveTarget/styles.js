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
        }
    }
});

export default styles;