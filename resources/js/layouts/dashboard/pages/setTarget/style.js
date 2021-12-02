const styles = theme => ({
    targetFormContainer: {
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',

        '& .formRow': {
            width: '100%',
            display: 'flex',
            margin: '10px 0',
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