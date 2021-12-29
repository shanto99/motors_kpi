const styles = theme => ({
    appContainer: {
        width: '100vw',
        maxWidth: '100%',
        height: '100vh',
        padding: '15px',
        '@media (max-width: 800px)': {
            padding: '0'
        },
    },
    pageWrapper: {
        position: 'relative',
        minHeight: '100%',
        width: '100%',
        borderRadius: '20px',
        boxSizing: 'border-box',
        boxShadow: '-1px 1px 20px 4px #80808061',
        overflow: 'hidden',
        padding: '20px 15px',
        '@media (max-width: 800px)': {
            paddingLeft: '20px 0'
        },
    },
    sidePanelClose: {
        '@media (max-width: 800px)': {
            position: 'absolute',
            width: '50%',
            top: 0,
            zIndex: '100',
            left: '-100%'
        }
    },
    sidePanelOpen: {
        '@media (max-width: 800px)': {
            height: '100vh',
            position: 'fixed',
            width: '100vw',
            top: 0,
            zIndex: '100',
            left: '0',
            backgroundColor: '#80808078'
        }
    },
    mainBody: {
        padding: '20px',
        width: '100%',
        '@media (max-width: 800px)': {
            padding: '0'
        },
    }
});

export default styles;
