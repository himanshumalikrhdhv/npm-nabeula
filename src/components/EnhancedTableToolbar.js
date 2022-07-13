import * as React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import Toolbar from "@mui/material/Toolbar";
import FolderDeleteIcon from "@mui/icons-material/FolderDelete";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { alpha } from "@mui/material/styles";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Grid } from "@mui/material";
const EnhancedTableToolbar = (props) => {
  const {
    SelectedFile,
    SelectedFolder,
    folderPath,
    containerName,
    handleDeleteFileDialog,
    handleDeleteFolder,
    handleCreateFolderDialog,
    handleUploadFileDialog,
    handleDownloadFile,
    handleRootFolder,
    toolBar,
  } = props;

  return (
    <div>
      <Toolbar
        style={{
          position: "fixed",
          right: -27,
          width: "100%",
          backgroundColor: "white",
        }}
        sx={{
          pl: { sm: 2 },

          bgcolor: (theme) => alpha(theme.palette.primary.main),
        }}
      >
        <IconButton onClick={handleRootFolder}>
          <KeyboardReturnIcon />
        </IconButton>
        <Grid container justifyContent="space-around">
          <Grid>
            <Typography variant="body1">
              DirectoryPath: {!folderPath ? "root" : folderPath}
            </Typography>
          </Grid>

          <Grid>
            <Typography sx={{ flex: "100%" }} variant="h6">
              Container Name :-
              {containerName}
            </Typography>
          </Grid>
        </Grid>

        {!toolBar && SelectedFile.length > 0 && SelectedFile.length <= 1 ? (
          <>
            <Tooltip title="Download File">
              <IconButton onClick={handleDownloadFile}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <></>
        )}

        {toolBar ? (
          <>
            {SelectedFile.length > 0 && SelectedFile.length <= 1 ? 
              <>
                <Tooltip title="Download File">
                  <IconButton onClick={handleDownloadFile}>
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              </>:
              <></>
            }
            {SelectedFile.length > 0 ? (
              <>
                <Tooltip title="Delete File">
                  <IconButton onClick={handleDeleteFileDialog}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <></>
            )}

            {SelectedFolder.length > 0 && SelectedFolder.length <= 1  ?
            <>
             <Tooltip title="Folder File">
                  <IconButton onClick={handleDeleteFolder}>
                    <FolderDeleteIcon />
                  </IconButton>
                </Tooltip>
            </>:
            <></>
            }
            <Tooltip title="CreateFolder">
              <IconButton onClick={handleCreateFolderDialog}>
                <CreateNewFolderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Upload File">
              <IconButton onClick={handleUploadFileDialog} type={"submit"}>
                <UploadFileIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <></>
        )}
      </Toolbar>
    </div>
  );
};

export default EnhancedTableToolbar;
