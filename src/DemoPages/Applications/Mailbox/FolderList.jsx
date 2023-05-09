import React, { Fragment, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Nav, NavItem, NavLink } from "reactstrap";
import { setAuthToken, setLoading } from "../../../reducers/Auth";
import { setMailFolderList, setSelectedFolder } from "../../../reducers/mail";
import { useLocation, useHistory } from "react-router-dom";
import { useMailService } from "../../../services/mail.service";

const FolderList = (props) => {
  const {setMailFolderList, setLoading, mailFolderList, selectedFolder, setSelectedFolder, token} = props;
  const location = useLocation();
  const [isCollapseSubFolder, setIsCollapseSubFolder] = useState({});
  // const history = useHistory();
  const [openCreateFolder, setOpenCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");
  const mailService = useMailService(token);
  const [openDeleteFolder, setOpenDeleteFolder] = useState({
    name: "",
    open: false,
  });
  const [openMoveFolder, setOpenMoveFolder] = useState({
    Oldfolderpath: "",
    Newfolderpath: "",
    open: false,
  });

  const handleCollapseSubFolder = (key) => {
    const t = isCollapseSubFolder[key];
    setIsCollapseSubFolder({ ...isCollapseSubFolder, [key]: !t });
  };

  const filteredFolders = useMemo(() => {
    let filterFolders = {
      folders: [],
      accordionFolders: {},
    };
    mailFolderList?.map((folder) => {
      const folderRoutes = folder.FolderName.split("/");
      const key = folderRoutes[0];
      const childRoutes = folderRoutes[1];
      if (childRoutes) {
        if (filterFolders.accordionFolders[key]) {
          filterFolders.accordionFolders[key].push(childRoutes);
        } else {
          filterFolders.accordionFolders[key] = [childRoutes];
        }
      } else {
        if (key == "Inbox") {
          filterFolders.folders.splice(0, 0, key);
        } else {
          filterFolders.folders.push(key);
        }
      }
    });
    if (!selectedFolder) {
      setSelectedFolder(filterFolders.folders[0]);
    }
    return filterFolders;
  }, [mailFolderList]);

  const handleFolderClick = (key) => {
    setSelectedFolder(key);
    // history.push("/apps/mailbox");
  };

  const handleCreateFolder = async () => {
    try {
      if (!folderName) {
        setOpenCreateFolder(false);
        return;
      }
      const res = await mailService.createMailFolder(folderName);
      console.log("create folder res: ", res);
      if (!res.ErrorMessage) {
        fetchMailFolderList();
      }
    } catch (error) {
      console.log("Error with create folder: ", error);
    } finally {
      setOpenCreateFolder(false);
      setFolderName("");
    }
  };

  const handleDeleteFolder = async (folder) => {
    try {
      const res = await mailService.deleteMailFolder(folder);
      console.log("delete folder res: ", res);
      if (!res.ErrorMessage) {
        fetchMailFolderList();
      }
    } catch (error) {
      console.log("Error with delete folder: ", error);
    } finally {
      setOpenDeleteFolder({ name: "", open: false });
    }
  };

  const handleOpenDelete = (folder) => {
    setOpenDeleteFolder({
      name: folder,
      open: true,
    });
  };

  const handleOpenMove = (folder) => {
    setOpenMoveFolder({
      Newfolderpath: "",
      Oldfolderpath: folder,
      open: true,
    });
  };

  const handleMoveFolder = async (oldFolder, newFolder) => {
    try {
      if (!newFolder) {
        setOpenMoveFolder({
          Newfolderpath: "",
          Oldfolderpath: "",
          open: false,
        });
        return;
      }
      const res = await mailService.moveMailFolder(oldFolder, newFolder);
      console.log("ressdjflksjd::", res);
      if (!res.ErrorMessage) {
        fetchMailFolderList();
      }
    } catch (error) {
      console.log("Error with move folder: ", error);
    } finally {
      setOpenMoveFolder({
        Newfolderpath: "",
        Oldfolderpath: "",
        open: false,
      });
    }
  };

  useEffect(() => {
    fetchMailFolderList();
  }, []);

  const fetchMailFolderList = async () => {
    try {
      setLoading(true);
      const res = await mailService.getMailFolders();
      setMailFolderList(res.mailfoldername);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Fragment>
      <Card className="app-inner-layout__sidebar">
      <div className="card-header">
          <h3 className="card-header-title">Folders</h3>
        </div>
        <div className="card-body p-0">
          <div className="flex-column accordion">
            {filteredFolders.folders?.map((folder, index) => {
              return (
                <div className="card-header d-flex justify-content-between no-after" key={`accordion-title-${index}`}>
                  <h2 className="mb-0 w-100">
                    <button className="btn btn-block text-left cursor-pointer" type="button" onClick={() => handleFolderClick(folder)}>
                      {folder}
                    </button>
                  </h2>
                  <h2 className="mb-0 d-flex">
                    <button className="btn btn-block text-left cursor-pointer m-0" type="button" onClick={() => handleOpenDelete(folder)}>
                      <i className="fas fa-trash"></i>
                    </button>
                    <button className="btn btn-block text-left cursor-pointer m-0" type="button" onClick={() => handleOpenMove(folder)}>
                      <i className="fas fa-share"></i>
                    </button>
                  </h2>
                </div>
              );
            })}
            {Object.entries(filteredFolders.accordionFolders)?.map((value, index) => {
              return (
                <div className={`card mb-0 ${!isCollapseSubFolder[value[0]] ? "collapsed-card" : ""}`} key={`accordion-title-${index}`}>
                  <div
                    className="card-header cursor-pointer"
                    onClick={() => {
                      handleCollapseSubFolder(value[0]);
                    }}
                  >
                    <h3 className="card-title accordion__title">{value[0]}</h3>
                    <div className="card-tools">
                      <button type="button" className="btn btn-tool" data-card-widget="collapse">
                        <i className={`fas ${!isCollapseSubFolder[value[0]] ? "fa-plus" : "fa-minus"}`}></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body p-0">
                    {value[1].map((subFolder, idx) => {
                      return (
                        <div className="card-header d-flex justify-content-between no-after" key={`accordion-item-${idx}`}>
                          <h2 className="mb-0 w-100">
                            <button className="btn btn-block text-left" type="button" onClick={() => handleFolderClick(value[0] + "/" + subFolder)}>
                              {subFolder}
                            </button>
                          </h2>
                          <h2 className="mb-0 d-flex">
                            <button
                              className="btn btn-block text-left cursor-pointer m-0"
                              type="button"
                              onClick={() => handleOpenDelete(value[0] + "/" + subFolder)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                            <button
                              className="btn btn-block text-left cursor-pointer m-0"
                              type="button"
                              onClick={() => handleOpenMove(value[0] + "/" + subFolder)}
                            >
                              <i className="fas fa-share"></i>
                            </button>
                          </h2>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      <button className="btn btn-secondary btn-block" onClick={() => setOpenCreateFolder(true)}>
        Create Folder
      </button>
      </Card>

    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  token: state.authReducer.token,
  loading: state.authReducer.loading,
  selectedFolder: state.mailReducer.selectedFolder,
  mailFolderList: state.mailReducer.mailFolderList,
});

const mapDispatchToProps = (dispatch) => ({
  setAuthToken: (token) => dispatch(setAuthToken(token)),
  setLoading: (loading) => dispatch(setLoading(loading)),
  setSelectedFolder: (selectedFolder) => dispatch(setSelectedFolder(selectedFolder)),
  setMailFolderList: (mailFolderList) => dispatch(setMailFolderList(mailFolderList)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FolderList);
