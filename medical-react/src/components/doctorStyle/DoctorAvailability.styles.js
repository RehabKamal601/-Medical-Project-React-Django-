export const styles = {
  mainContainer: {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    p: 3
  },
  successModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    textAlign: 'center'
  },
  successIcon: {
    color: '#4CAF50',
    fontSize: '60px',
    mb: 2
  },
  continueButton: {
    backgroundColor: '#4a90e2',
    '&:hover': {
      backgroundColor: '#3a80d2'
    }
  },
  pageTitle: {
    fontWeight: 'bold',
    color: '#1e293b',
    mb: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 1
  },
  mainPaper: {
    p: 4,
    borderRadius: '12px',
    background: 'white'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: '#3b82f6'
  },
  divider: {
    mb: 3
  },
  dayPaper: (isSelected) => ({
    p: 2,
    borderRadius: '8px',
    borderLeft: `4px solid ${isSelected ? '#10b981' : '#e2e8f0'}`
  }),
  dayLabel: {
    mb: 2
  },
  timeContainer: {
    mt: 1,
    pl: 4
  },
  timeLabel: {
    display: "block",
    color: "text.secondary"
  },
  saveButton: {
    px: 4,
    py: 1.5,
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '1rem'
  },
  availabilitySection: {
    mt: 4
  },
  availabilityTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    mb: 2
  }
}; 