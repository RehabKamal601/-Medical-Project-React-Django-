export const styles = {
  container: {
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    p: 4,
    transition: 'all 0.3s ease'
  },
  title: {
    fontWeight: 700,
    color: '#1a237e',
    mb: 4,
    fontSize: '2.2rem',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '4px',
      backgroundColor: '#4a90e2',
      borderRadius: '2px'
    }
  },
  paper: {
    p: 5,
    borderRadius: '20px',
    maxWidth: '800px',
    mx: 'auto',
    backgroundColor: 'white',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)'
    }
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    mb: 4,
    position: 'relative'
  },
  avatar: {
    width: 150,
    height: 150,
    border: '4px solid #4a90e2',
    boxShadow: '0 4px 20px rgba(74,144,226,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 25px rgba(74,144,226,0.3)'
    }
  },
  textField: {
    mb: 3,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '&:hover': {
        '& fieldset': {
          borderColor: '#4a90e2'
        }
      },
      '&.Mui-focused': {
        '& fieldset': {
          borderWidth: '2px',
          borderColor: '#4a90e2'
        }
      }
    },
    '& .MuiInputLabel-root': {
      color: '#546e7a'
    },
    '& .MuiInputAdornment-root': {
      '& .MuiSvgIcon-root': {
        color: '#4a90e2',
        fontSize: '1.5rem'
      }
    }
  },
  bioField: {
    mb: 4,
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px'
    }
  },
  divider: {
    my: 4,
    backgroundColor: '#e3f2fd'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    mt: 2
  },
  saveButton: {
    px: 5,
    py: 1.8,
    borderRadius: '12px',
    backgroundColor: '#4a90e2',
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 15px rgba(74,144,226,0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#357abd',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(74,144,226,0.3)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  },
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    p: 4,
    borderRadius: '20px',
    textAlign: 'center',
    animation: 'modalFadeIn 0.3s ease'
  },
  successIcon: {
    color: '#4CAF50',
    fontSize: '70px',
    mb: 3,
    animation: 'iconPop 0.5s ease'
  },
  modalButton: {
    backgroundColor: '#4a90e2',
    borderRadius: '12px',
    px: 4,
    py: 1.5,
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#357abd',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(74,144,226,0.3)'
    }
  }
}; 