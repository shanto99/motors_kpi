const styles = theme => ({
    tableContainer: {
        width: '100%',
        maxWidth: '900px',

        '& .tableCell': {
            border: '1px solid'
        },

        '& .coloredRow': {
            backgroundColor: 'yellow',

            '& .tableCell': {
                fontWeight: 'bold'
            }
        }
    }
});

export default styles;