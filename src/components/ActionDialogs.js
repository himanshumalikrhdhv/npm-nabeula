import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
const ActionDialogs = (props) => {
  const {
    open,
    setOpen,
    save,
    setSave,
    folderPath,
    deleteFileOpen,
    setDeleteFileOpen,
    deleteFolderOpen,
    setDeleteFolderOpen,
    deleteFolderName,
    uploadFileOpen,
    setUploadFileOpen,
    fileDeleteName,
    handleDeleteFile,
    handleDeleteFolder,
    NewFolderName,
    folderName,
    setNewFolderName,
    handleSaveFolderUploadDialog,
    handleFolderCreation,
    handleUploadFile,
  } = props;
  const [handleSubmitBtn, setHandleSubmitBtn] = React.useState("")
  const handleClose = () => {
    setOpen(false);
  };
  const handleSaveClose = () => {
    setSave(false);
  };
  const handleFileDeleteClose = () => {
    setDeleteFileOpen(false);
  };
  const handleFolderDeleteClose = () => {
    setDeleteFolderOpen(false);
  };
  const handleUploadFileClose = () => {
    setUploadFileOpen(false);
  };

  const handleChange = (event) => {
    event.preventDefault();
    setHandleSubmitBtn(event.target.value)
    setNewFolderName(event.target.value);
  };
  const validate = !handleSubmitBtn || handleSubmitBtn.length <= 0;

  return (
    <>
      <div>
        <Dialog open={open}>
          <DialogTitle>Enter Folder Name</DialogTitle>
          <DialogContent>{`${folderPath}/`}</DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Folder Name"
              type="text"
              fullWidth
              required
              variant="outlined"
              value={NewFolderName}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" disabled={validate}  onClick={handleSaveFolderUploadDialog}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={save}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Upload file in  "${handleSubmitBtn}" folder`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleSaveClose}>Disagree</Button>
            <Button variant="outlined" onClick={handleFolderCreation}>Agree</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={deleteFileOpen}
          onClose={handleFileDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Do you want to delete "${fileDeleteName}" File ?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleFileDeleteClose}>No</Button>
            <Button
              variant="outlined"
              onClick={handleDeleteFile}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={deleteFolderOpen}
          onClose={handleFolderDeleteClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Do you want to delete "${deleteFolderName}" Folder ?`}
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleFolderDeleteClose}>No</Button>
            <Button
              variant="outlined"
              onClick={handleDeleteFolder}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
       
      <div>
        <Dialog
          open={uploadFileOpen}
          onClose={handleUploadFileClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
           {` Do you want to upload a file in "${folderName?folderName: "root"}" folder`}. 
          </DialogTitle>
          <DialogActions>
            <Button onClick={handleUploadFileClose}>Disagree</Button>
            <Button variant="outlined" onClick={handleUploadFile}>Agree</Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default ActionDialogs;
