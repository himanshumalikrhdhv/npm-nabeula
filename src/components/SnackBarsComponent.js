import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackBarsComponent = (props) => {
  const {snackBarOpen,
    setSnackBarOpen,
    snackBarActionTittle,
    snackBarActionType,
  } =props;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={snackBarOpen} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackBarActionType} sx={{ width: '100%' }}>
          {snackBarActionTittle}
        </Alert>
      </Snackbar>
    </Stack>
  );
}

export default SnackBarsComponent;