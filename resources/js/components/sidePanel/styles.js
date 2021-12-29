const styles = theme => ({
    sidePanelContainer: {
        width: '100%',
        height: '100%',
        padding: '10px',
        paddingLeft: '50px',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '@media (max-width: 800px)': {
            paddingLeft: '10px',
            maxWidth: '200px',
        },
        '& .sidePanelHeader': {
            '@media (max-width: 800px)': {
                '& .MuiTypography-h4': {
                    fontSize: '20px'
                },
                '& .MuiTypography-p': {
                    fontSize: '12px !important'
                }
             },
        },
        '& .sidebarMenuList': {
            background: '#7b6ab2',
            border: '8px solid #6d5d9e',
            borderRight: 'none',
            borderBottom: 'none',
            marginTop: '50px',
            padding: '20px 0',
            borderRadius: '0 15px 15px 0',
            overflow: 'hidden',
            '@media (max-width: 800px)': {
                marginTop: '20px'
            }
        }
    },
    menuItem: {
        color: 'white',
        textDecoration: 'none !important',
        '& span': {
            fontSize: '18px',
            '@media (max-width: 800px)': {
                fontSize: '12px'
            }
        },
        '& li': {
            paddingLeft: '35px',
            '@media (max-width: 800px)': {
                paddingLeft: '15px'
            }
        }
    },
    logoutBtn: {
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        fontSize: '16px',
        background: 'none',
        cursor: 'pointer',
        '& span': {
            marginRight: '15px'
        }
    }
});

export default styles;
