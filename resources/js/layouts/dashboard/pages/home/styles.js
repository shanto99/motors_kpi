const styles = theme => ({
    kpiSearchForm: {
        width: '100%', 
        maxWidth: '900px', 
        margin: '0 auto', 
        marginBottom: '60px', 
        display: 'flex', 
        justifyContent: 'center',
        '@media (max-width: 800px)': {
            display: 'block'
        },
        '& .autoCompleteContainer': {
            display: 'flex', 
            alignItems: 'center', 
            marginRight: '20px', 
            flex: '1',
            '@media (max-width: 800px)': {
                display: 'block',
                marginBottom: '20px'
            },
        }
    },
    datePickerContainer: {
        display: 'flex', 
        alignItems: 'center', 
        marginRight: '20px', 
        flex: '1',
        '@media (max-width: 800px)': {
            display: 'block',
            marginBottom: '20px'
        },
        '& input': {
            height: '50px',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '5px 8px'
        }
    }
});

export default styles;