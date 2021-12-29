const styles = theme => ({
    kpiFormHeader: {
        display: 'flex',
        maxWidth: '500px',
        justifyContent: 'space-between',
        marginBottom: '60px',
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