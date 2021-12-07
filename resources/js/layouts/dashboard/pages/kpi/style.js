const styles = theme => ({
    kpiFormHeader: {
        width: '100%',
        maxWidth: '500px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    kpiFormHeader: {
        display: 'flex',
        width: '100%',
        maxWidth: '500px',
        justifyContent: 'space-between',
        alignItems: 'center',
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