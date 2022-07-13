import React, { useEffect, useState, Fragment } from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Checkbox, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import CommanComponentKS from "./CommanComponentKS";
import {
  convertTime,
  fileSize,
  findObject,
  getFolder,
  sortArray,
} from "./utilsKS";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import ActionDialogs from "./ActionDialogs";
import SnackBarsComponent from "./SnackBarsComponent";
import { saveAs } from "file-saver";
const { BlobServiceClient } = require("@azure/storage-blob");
const useStyles = makeStyles(() => ({
  divFileName: {
    "& .MuiTypography-root, .MuiLink-root,": {
      fontSize: 14,
    },
    "& svg": {
      marginRight: useTheme().spacing(1),
    },
    "&:hover": {
      cursor: "pointer",
      "& .MuiSvgIcon-root": {
        color: useTheme().palette.primary.main,
      },
    },
  },
  tableBody: {
    "& .MuiCollapse-root": {
      "& tr": {
        width: "100% !important",
      },
    },
  },
  checkboxtd: {
    width: "10px !important",
  },
}));

const FolderListKS = (props) => {
  const { baseUrl, sasString, containerName, fileInfo, toolBar } = props;
  const classes = useStyles();
  const blobSasUrl = baseUrl + sasString;
  const blobServiceClient = new BlobServiceClient(blobSasUrl);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const [structured, setStructured] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [saveDialog, setSaveDialog] = useState(false);
  const [uploadFileOpen, setUploadFileOpen] = useState(false);
  const [deleteFileOpen, setDeleteFileOpen] = useState(false);
  const [deleteFolderOpen, setDeleteFolderOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarActionTittle, setSnackBarActionTittle] = useState("");
  const [snackBarActionType, setSnackBarActionType] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState([]);
  const [folderPath, setFolderPath] = useState(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderName, setFolderName] = useState(null);
  const [fileDeleteName, setFileDeleteName] = useState("");
  const [deleteFolderName, setDeleteFolderName] = useState("");
  const [expendedClose, setExpendedClose] = useState(true);
  const fileInput = document.getElementById("file-input");



  // console.log("structured", structured);
  useEffect(() => {
    async function listFiles() {
      try {
        const ListArr =[];
        let iter = containerClient.listBlobsFlat();
        await iter.next().then(async (blobItem) => {
          while (!blobItem.done) {
            const item = {
              name: blobItem.value.name,
              properties: blobItem.value.properties,
            };
            
             ListArr.push(item);
            blobItem = await iter.next();
          }
          const data = getFolder(ListArr);
          setStructured(sortArray(data));
        });
      } catch (error) {
        console.log(error.message);
      }
    }
    listFiles();

    // eslint-disable-next-line
  }, []);

  const handleUploadFileDialog = () => {
    const folderName =
      folderPath === null ? folderPath : folderPath.split("/").splice(-1).pop();
    setFolderName(folderName);
    setSelectedFile([]);
    setUploadFileOpen(true);
  };
  const handleUploadFile = async () => {
    const clone = [...structured];
    const singleObj = findObject(folderPath, clone);
    var name = "";
    let newFolderPath = "";
    if (newFolderName !== "") {
      newFolderPath =
        folderPath === null ? newFolderName : `${folderPath}/${newFolderName}`;
    } else {
      newFolderPath = folderPath;
    }

    try {
      for (let file of fileInput.files) {
        var files = file;
        name = file.name;
      }
      if(name === "")
       return;
      const uploadfileName =
        newFolderPath === null ? name : `${newFolderPath}/${name}`;
      if (singleObj && uploadfileName) {
        const checkExist = singleObj.content.some(
          (f) => f.key === uploadfileName
        );
        if (checkExist) {
          setSnackBarActionType("error");
          setSnackBarActionTittle(` File Already exists`);
          setSnackBarOpen(true);
          return;
        }
      }
      if (!singleObj && uploadfileName) {
        const checkExist = structured.some(
          (f) => f.key === uploadfileName
        );
        if (checkExist) {
          setSnackBarActionType("error");
          setSnackBarActionTittle(` File Already exists`);
          setSnackBarOpen(true);
          return;
        }
      }
      const blockBlobClient =
        containerClient.getBlockBlobClient(uploadfileName);
      await blockBlobClient.uploadData(files).then((res) => {
        if (newFolderName !== "") {
          if (singleObj) {
            singleObj.content.push({
              title: newFolderName,
              props: null,
              key: `${newFolderPath}`,
              content: [
                {
                  title: name,
                  key: `${newFolderPath}/${name}`,
                  props: res,
                },
              ],
            });
          } else {
            clone.push({
              title: newFolderName,
              props: null,
              key: `${newFolderPath}`,
              content: [
                {
                  title: name,
                  key: `${newFolderPath}/${name}`,
                  props: res,
                },
              ],
            });
          }
        } else {
          if (singleObj) {
            singleObj.content.push({
              title: name,
              props: res,
              key: uploadfileName,
            });
          } else {
            clone.push({ title: name, props: res, key: uploadfileName });
          }
        }
        const sortClone = sortArray(clone);
        setStructured(sortClone);
        setSnackBarActionType("success");
        setSnackBarActionTittle(` File Uploaded Successfully`);
        setSnackBarOpen(true);
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const onFileChange = (event) => {
    // capture file into state
    handleUploadFile();
    setNewFolderName("");
  };
  const takeFile = () => {
    setUploadFileOpen(false);

    fileInput.click();
  };
  console.log('structured', structured)
  const handleSaveFolderUploadDialog = () => {
    const clone = [...structured];
    const singleObj = findObject(folderPath, clone);
    if (singleObj && newFolderName) {
      const checkFolder = singleObj.content.some(
        (f) =>
          f.title.trim().toLowerCase() === newFolderName.trim().toLowerCase()
         );
      if (checkFolder) {
        setSnackBarActionType("error");
        setSnackBarActionTittle(` Folder Already Exist`);
        setSnackBarOpen(true);
        return;
      }
    }
    if (!singleObj && newFolderName) {
      const checkFolder = clone.some(
        (f) =>
          f.title.trim().toLowerCase() === newFolderName.trim().toLowerCase()
         );
      if (checkFolder) {
        setSnackBarActionType("error");
        setSnackBarActionTittle(` Folder Already Exist`);
        setSnackBarOpen(true);
        return;
      }
    }
    setSaveDialog(true);
  };
  const handleCreateFolderDialog = () => {
    setOpenDialog(true);
  };
  const handleCreateFolder = () => {
    takeFile();
    setOpenDialog(false);
    setSaveDialog(false);
    setSnackBarActionType("success");
    setSnackBarActionTittle(`"${newFolderName}" Folder Create Successfully`);
    setSnackBarOpen(true);
  };
  const handleDeleteFileDialog = () => {
    setDeleteFileOpen(true);
    // const FileName =  fileName.split("/").slice(-1).pop();
    setFileDeleteName(selectedFile);
  };
  const handleDeleteFile = async () => {
    setSnackBarActionType("warning");
    setSnackBarActionTittle("File Deleted Successfully");
    setSnackBarOpen(true);
    setDeleteFileOpen(false);
    for (let item of selectedFile) {
      const filename = item;
      const blobFileDelete = containerClient.getBlobClient(filename);
      await blobFileDelete.deleteIfExists().then(() => {
        const listClone = [...structured];
        let splitFilePath = filename.split("/").slice(-1).pop();
        console.log('splitFilePath', splitFilePath)
        let key = filename.split(`/${splitFilePath}`)[0];
        console.log('key1', key)
        let array = findObject(key, listClone);
        console.log('array', array)
        if (!array.content) {
          const index = listClone.findIndex((f) => f.key === filename);
          if (index >= 0) {
            listClone.splice(index, 1);
          }
        } else if (array.content.length > 0) {
          const index = array.content.findIndex((f) => f.key === filename);
          if (index >= 0) {
            array.content.splice(index, 1);
          }
        }
        if (!array.content) {
          const index = listClone.findIndex((f) => f.key === filename);
          if (index >= 0) {
            listClone.splice(index, 1);
          }
        } else if (array &&  array.content.length <= 0) {
          
          removeEmptyFolder(key, array);

          function removeEmptyFolder(key, array) {
          console.log('key2', key)

            let splitFolder =
              key && `/${array.title}` ? key.split(`/${array.title}`)[0] : null;
              console.log('splitFolder', splitFolder)
            if (splitFolder === null){          
              setFolderPath(null)
              return;            
            } 
              
            let arr1 = findObject(splitFolder, listClone);
            const index = arr1.content.findIndex((f) => f.key === key);
            if (index >= 0) {
              arr1.content.splice(index, 1);
            } else {
              const indexOuter = structured.findIndex((a) => a.key === key);
              if (indexOuter >= 0) {
                structured.splice(indexOuter, 1);
              }
            }
            if (arr1 && (!arr1.content || arr1.content.length <= 0)) {
              const index = structured.findIndex((f) => f.key === filename);
              if (index >= 0) {
                structured.splice(index, 1);
              }
              removeEmptyFolder(splitFolder, arr1);
            }
          }

        }

        setStructured(listClone);
            setSelectedFolder([]);
    setSelectedFile([]);
      });
    }

  };
  const handleDeleteFolderDialog = () => {
    setDeleteFolderOpen(true);
    const FolderName = folderPath.split("/").slice(-1).pop();
    setDeleteFolderName(FolderName);
  };
  const handleDeleteFolder = async () => {
    setSnackBarActionType("warning");
    setSnackBarActionTittle("Folder Deleted Successfully");
    setSnackBarOpen(true);
    setDeleteFolderOpen(false);
    const listClone = [...structured];
    const getFolder = findObject(folderPath, listClone);
    deleteFolder(getFolder);
    function deleteFolder(arr) {
      for (let item in arr.content) {
        if (arr.content[item].content) {
          deleteFolder(arr.content[item]);
        }
        const getName = arr.content[item].key;
        const folderDelete = containerClient.getBlobClient(getName);
        folderDelete.deleteIfExists().then(() => {
          let parentKey = arr.key.split(`/${arr.title}`)[0];
          let parentObj = findObject(parentKey, listClone);
          const index = parentObj.content.findIndex(
            (f) => f.key === folderPath
          );
          if (index >= 0) {
            parentObj.content.splice(index, 1);
          } else {
            const indexOuter = listClone.findIndex((a) => a.key === folderPath);
            if (indexOuter >= 0) {
              listClone.splice(indexOuter, 1);
            }
          }
          setStructured(listClone);
        });
      }
    }
    setSelectedFolder([]);
    setSelectedFile([]);
    setFolderPath(null);
  };
  const handleRootFolder = () => {
    setFolderPath(null);
    setSelectedFile([]);
    setSelectedFolder([]);
    setExpendedClose(false);
  };
  const handleDownloadFile = async () => {
    const FileName = selectedFile[0].split("/").slice(-1).pop();
    const blobClient = containerClient.getBlobClient(selectedFile[0]);
    const downloadBlockBlobResponse = await blobClient
      .download()
      .then((res) => res.blobBody)
      .then((blob) => URL.createObjectURL(blob))
      .catch((err) => err.massage);
    saveAs(downloadBlockBlobResponse, FileName);
    setSnackBarActionType("success");
    setSnackBarActionTittle(`"${FileName}" File Download Successfully`);
    setSnackBarOpen(true);
  };
  const handleFileClick = (event, name) => {
    const selectedIndex = selectedFile.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedFile, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedFile.slice(1));
    } else if (selectedIndex === selectedFile.length - 1) {
      newSelected = newSelected.concat(selectedFile.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedFile.slice(0, selectedIndex),
        selectedFile.slice(selectedIndex + 1)
      );
    }
    setSelectedFile(newSelected);
  };
  const isSelected = (name) => selectedFile.indexOf(name) !== -1;
  const isSelectedFolder = (value) => selectedFolder.indexOf(value) !== -1;
  return !structured ? (
    <Fragment />
  ) : (
    <div>
      <SnackBarsComponent
        snackBarOpen={snackBarOpen}
        setSnackBarOpen={setSnackBarOpen}
        snackBarActionTittle={snackBarActionTittle}
        snackBarActionType={snackBarActionType}
      />
      <EnhancedTableToolbar
        SelectedFile={selectedFile}
        SelectedFolder={selectedFolder}
        folderPath={folderPath}
        containerName={containerName}
        handleDeleteFileDialog={handleDeleteFileDialog}
        handleDeleteFolder={handleDeleteFolderDialog}
        handleUploadFileDialog={handleUploadFileDialog}
        handleCreateFolderDialog={handleCreateFolderDialog}
        handleRootFolder={handleRootFolder}
        handleDownloadFile={handleDownloadFile}
        toolBar={toolBar}
      />
      <ActionDialogs
        open={openDialog}
        setOpen={setOpenDialog}
        save={saveDialog}
        setSave={setSaveDialog}
        folderPath={folderPath}
        newFolderName={newFolderName}
        folderName={folderName}
        setNewFolderName={setNewFolderName}
        fileDeleteName={fileDeleteName}
        deleteFileOpen={deleteFileOpen}
        deleteFolderName={deleteFolderName}
        setDeleteFileOpen={setDeleteFileOpen}
        deleteFolderOpen={deleteFolderOpen}
        setDeleteFolderOpen={setDeleteFolderOpen}
        uploadFileOpen={uploadFileOpen}
        setUploadFileOpen={setUploadFileOpen}
        handleFolderCreation={handleCreateFolder}
        handleSaveFolderUploadDialog={handleSaveFolderUploadDialog}
        handleDeleteFile={handleDeleteFile}
        handleDeleteFolder={handleDeleteFolder}
        handleUploadFile={takeFile}
      />
      <TableContainer component={Paper}>
        <input
          type="file"
          name="file"
          id="file-input"
          onChange={onFileChange}
          style={{ display: "none" }}
        />

        <Table sx={{ paddingTop: "50px", borderCollapse: "unset" }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" className={classes.checkboxtd}>
                <Checkbox color="primary" checked={false} />
              </TableCell>
              <TableCell>Name</TableCell>
              {fileInfo ? (
                <>
                  <TableCell>Size</TableCell>
                  <TableCell>LastModified</TableCell>
                </>
              ) : (
                <>
                  <TableCell />
                  <TableCell />
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {structured.map((obj) => {
              const isItemSelected = isSelected(obj.key);
              const isItemSelectedFolder = isSelectedFolder(obj)
              return obj.content ? (
                <CommanComponentKS
                  key={obj.title}
                  folderObj={obj}
                  setFolderPath={setFolderPath}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  selectedFolder={selectedFolder}
                  setSelectedFolder={setSelectedFolder}
                  expendedClose={expendedClose}
                  setExpendedClose={setExpendedClose}
                  fileInfo={fileInfo}
                  isItemSelectedFolder={isItemSelectedFolder}
                />
              ) : (
                <TableRow
                  key={obj.title}
                  hover
                  className={classes.divFileName}
                  onClick={(e) => handleFileClick(e, obj.key)}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox" className={classes.checkboxtd}>
                    <Checkbox color="primary" checked={isItemSelected} />
                  </TableCell>
                  <TableCell style={{ display: "flex" }}>
                    <InsertDriveFileIcon color="primary" />
                    <Typography>{obj.title}</Typography>
                  </TableCell>
                  {fileInfo ? (
                    <>
                      <TableCell>
                        {" "}
                        {fileSize(obj.props.contentLength)}
                      </TableCell>
                      <TableCell>
                        {" "}
                        {convertTime(obj.props.lastModified)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell />
                      <TableCell />
                    </>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FolderListKS;
