import React, { useState, Fragment } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { Typography, Collapse, Link, Checkbox, TableBody } from "@mui/material";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";
import { convertTime, fileSize } from "./utilsKS";
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
    },
  },
  divFolderName: {
    "& .MuiTableCell-root": {
      width: "10% !important",
    },
    "& .MuiTypography-root, .MuiLink-root,": {
      fontSize: 14,
    },
    "& svg": {
      marginRight: useTheme().spacing(1),
      color: " #e6b800",
    },
    "&:hover": {
      cursor: "pointer",
      "& .MuiTypography-root, .MuiLink-root,": {
        fontWeight: "bold",
      },
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
    width: "10px !importnt",
  },
}));
const CommanComponentKS = (props) => {
  const classes = useStyles();
  const {
    folderObj,
    setFileName,
    setFolderPath,
    expendedClose,
    selectedFile,
    setSelectedFile,
    selectedFolder,
    setSelectedFolder,
    setExpendedClose,
    fileInfo,
    isItemSelectedFolder,
  } = props;
  const [expended, setExpended] = useState(false);

  if (expended === true && expendedClose === false) {
    setExpended(false);
  }

  const handleFolderCheckBox = (event, value) => {
    const selectedFolderIndex = selectedFolder.indexOf(value);
    let newSelected = [];
    if (selectedFolderIndex === -1) {
      newSelected = newSelected.concat(selectedFolder, value);
    } else if (selectedFolderIndex === 0) {
      newSelected = newSelected.concat(selectedFolder.slice(1));
    } else if (selectedFolderIndex === selectedFolder.length - 1) {
      newSelected = newSelected.concat(selectedFolder.slice(0, -1));
    } else if (selectedFolderIndex > 0) {
      newSelected = newSelected.concat(
        selectedFolder.slice(0, selectedFolderIndex),
        selectedFolder.slice(selectedFolderIndex + 1)
      );
    }
    setFolderPath(value ? value.key : "");
    setSelectedFolder(newSelected);
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
  const handleFolderClick = (event, value) => {
    setFolderPath(value ? value.key : "");
    setExpendedClose(true);
    setExpended(!expended);
  };

  const isSelected = (name) => selectedFile.indexOf(name) !== -1;
  const isSelectedFolder = (value) => selectedFolder.indexOf(value) !== -1;
  return (
    <Fragment>
      <TableRow hover className={classes.divFoldeName}>
        <TableCell padding="checkbox" className={classes.checkboxtd}>
          <Checkbox
            color="primary"
            onClick={(e) => handleFolderCheckBox(e, folderObj)}
            checked={isItemSelectedFolder}
          />
        </TableCell>
        <TableCell
          style={{ display: "flex" }}
          className={classes.divFolderName}
          onClick={(e) => handleFolderClick(e, folderObj)}
        >
          {expended ? (
            <FolderOpenIcon onClick={handleFolderClick} />
          ) : (
            <FolderIcon onClick={handleFolderClick} />
          )}
          <Link onClick={handleFolderClick}>{folderObj.title}</Link>
        </TableCell>
        <TableCell />
        <TableCell />
      </TableRow>

      {!folderObj.content || folderObj.content.length <= 0 ? (
        <Fragment />
      ) : (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={expended}>
              <Table>
                <TableBody>
                  {folderObj.content.map((obj) => {
                    const isItemSelected = isSelected(obj.key);
                    const isItemSelectedFolder = isSelectedFolder(obj)
                    return obj.content ? (
                      <CommanComponentKS
                        key={obj.title}
                        folderObj={obj}
                        setFolderPath={setFolderPath}
                        setFileName={setFileName}
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
                        role="checkbox"
                        hover
                        tabIndex={-1}
                        key={obj.title}
                        aria-checked={isItemSelected}
                        onClick={(e) => handleFileClick(e, obj.key)}
                        selected={isItemSelected}
                      >
                        <TableCell
                          padding="checkbox"
                          className={classes.checkboxtd}
                        >
                          <Checkbox color="primary" checked={isItemSelected} />
                        </TableCell>
                        <TableCell
                          style={{ display: "flex" }}
                          className={classes.divFileName}
                        >
                          <InsertDriveFileIcon color="primary" />
                          <Typography>{obj.title}</Typography>
                        </TableCell>

                        {!obj.props ? (
                          <>
                            <TableCell />
                          </>
                        ) : (
                          <>
                            {fileInfo ? (
                              <>
                                <TableCell>
                                  {fileSize(obj.props.contentLength)}
                                </TableCell>
                                <TableCell>
                                  {convertTime(obj.props.lastModified)}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell />
                                <TableCell />
                              </>
                            )}
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
};

export default CommanComponentKS;
