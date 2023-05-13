import React, { Fragment, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { Button, Card, CardHeader, Collapse, Input, Modal, ModalBody, ModalFooter, ModalHeader, Nav, NavItem, NavLink } from "reactstrap";
import { setAuthToken, setLoading } from "../../../reducers/Auth";
import { setMailFolderList, setSelectedFolder } from "../../../reducers/mail";
import { useLocation, useHistory } from "react-router-dom";
import { useMailService } from "../../../services/mail.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faShare, faTrash } from "@fortawesome/free-solid-svg-icons";
import makeAnimated from "react-select/animated";
import Select from "react-select";
const animatedComponents = makeAnimated();

const FolderList = (props) => {
  const { setMailFolderList, setLoading, mailFolderList, selectedFolder, setSelectedFolder, token } = props;
  const location = useLocation();
  const [isCollapseSubFolder, setIsCollapseSubFolder] = useState({});
  const history = useHistory();
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
        handleCloseMoveMail();
        return;
      }
      const res = await mailService.moveMailFolder(oldFolder, newFolder);
      if (!res.ErrorMessage) {
        fetchMailFolderList();
        setSelectedFolder(newFolder);
      }
    } catch (error) {
      console.log("Error with move folder: ", error);
    } finally {
      handleCloseMoveMail();
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

  const handleCloseMoveMail = () => {
    setOpenMoveFolder({
      Newfolderpath: "",
      Oldfolderpath: "",
      open: false,
    });
  };

  const handleComposeMail = () => {
    history.push("/apps/mailbox?create=new-mail")
  }

  return (
    <Fragment>
      <Card className="app-inner-layout__sidebar">
        <div className="d-flex mb-2 mt-1 w-100">
          <button className="btn btn-primary btn-block w-100 ms-2 me-2" onClick={handleComposeMail}>
            Compose Mail
          </button>
        </div>
        <div className="card-header">
          <h6 className="card-header-title fw-bolder mb-0">Folders</h6>
        </div>
        <div className="card-body p-0">
          <div className="flex-column accordion">
            {filteredFolders.folders?.map((folder, index) => {
              return (
                <CardHeader className="card-header d-flex justify-content-between no-after" key={`accordion-title-${index}`}>
                  <h2 className="mb-0 w-100 d-flex">
                    <button className="btn btn-block text-start" type="button" onClick={() => handleFolderClick(folder)}>
                      {folder}
                    </button>
                  </h2>
                  <h2 className="mb-0 d-flex">
                    <button className="btn btn-block text-start m-0 pe-2" type="button" onClick={() => handleOpenDelete(folder)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="btn btn-block text-start m-0 ps-2" type="button" onClick={() => handleOpenMove(folder)}>
                      <FontAwesomeIcon icon={faShare} />
                    </button>
                  </h2>
                </CardHeader>
              );
            })}
            {Object.entries(filteredFolders.accordionFolders)?.map((value, index) => {
              return (
                <div className={`card mb-0 ${!isCollapseSubFolder[value[0]] ? "collapsed-card" : ""}`} key={`accordion-title-${index}`}>
                  <CardHeader
                    className="d-flex justify-content-between"
                    onClick={() => {
                      handleCollapseSubFolder(value[0]);
                    }}
                  >
                    <h3 className="card-title accordion__title mb-0">{value[0]}</h3>
                    <div className="card-tools">
                      {/* <Button type="button" className="btn btn-tool" outline data-card-widget="collapse"> */}
                      <FontAwesomeIcon icon={!isCollapseSubFolder[value[0]] ? faPlus : faMinus} />
                      {/* </Button> */}
                    </div>
                  </CardHeader>
                  <Collapse isOpen={isCollapseSubFolder[value[0]]} className="card-body p-0">
                    {value[1].map((subFolder, idx) => {
                      return (
                        <div className="card-header d-flex justify-content-between no-after" key={`accordion-item-${idx}`}>
                          <h2 className="mb-0 w-100 d-flex">
                            <button
                              className="btn btn-block text-start w-100"
                              type="button"
                              onClick={() => handleFolderClick(value[0] + "/" + subFolder)}
                            >
                              {subFolder}
                            </button>
                          </h2>
                          <h2 className="mb-0 d-flex">
                            <button
                              className="btn btn-block text-start m-0 pe-2"
                              type="button"
                              onClick={() => handleOpenDelete(value[0] + "/" + subFolder)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            <button
                              className="btn btn-block text-start m-0 ps-2"
                              type="button"
                              onClick={() => handleOpenMove(value[0] + "/" + subFolder)}
                            >
                              <FontAwesomeIcon icon={faShare} />
                            </button>
                          </h2>
                        </div>
                      );
                    })}
                  </Collapse>
                </div>
              );
            })}
          </div>
          <div className="d-flex mt-2 w-100">
            <button className="btn btn-secondary btn-block w-100 ms-2 me-2" onClick={() => setOpenCreateFolder(true)}>
              Create Folder
            </button>
          </div>
        </div>
      </Card>

      {/* Create Mail Folder */}
      <Modal isOpen={openCreateFolder} toggle={() => setOpenCreateFolder(false)}>
        <ModalHeader toggle={() => setOpenCreateFolder(false)} className="fw-bolder">
          Create Mail Folder
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="moveMailsSelect" className="mb-2 fw-bolder">
              Enter Mail Folder Name:
            </label>

            <Input
              placeholder="Folder Name"
              type="text"
              onChange={(e) => {
                setFolderName(e.target.value);
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="link" onClick={() => setOpenCreateFolder(false)}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleCreateFolder}>
            Create
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Mail Folder */}
      <Modal isOpen={openDeleteFolder.open} toggle={() => setOpenDeleteFolder({ name: "", open: false })}>
        <ModalHeader toggle={() => setOpenDeleteFolder({ name: "", open: false })} className="fw-bolder">
          Delete Folder
        </ModalHeader>
        <ModalBody>
          <div className="form-group">Are you sure that you want to Delete this Folder "{openDeleteFolder.name}"?</div>
        </ModalBody>
        <ModalFooter>
          <Button color="link" onClick={() => setOpenDeleteFolder({ name: "", open: false })}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => handleDeleteFolder(openDeleteFolder.name)}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      {/* Move Selected Folder */}
      <Modal isOpen={openMoveFolder.open} toggle={handleCloseMoveMail}>
        <ModalHeader toggle={handleCloseMoveMail} className="fw-bolder">
          Move Folder
        </ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label htmlFor="moveMailsSelect" className="mb-2 fw-bolder">
              Move Mails To:
            </label>

            <Select
              // className="form-control"
              id="moveMailsSelect"
              placeholder="Select New Folder"
              onChange={(e) => setOpenMoveFolder((prevVal) => ({ ...prevVal, Newfolderpath: e.value }))}
              closeMenuOnSelect={true}
              components={animatedComponents}
              defaultValue={openMoveFolder.Newfolderpath}
              // onChange={handleSortingSelect}
              className={`react-sorting-select`}
              options={mailFolderList.map((folder) => ({
                label: folder.FolderName,
                value: folder.FolderName,
              }))}
            ></Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="link" onClick={handleCloseMoveMail}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => handleMoveFolder(openMoveFolder.Oldfolderpath, openMoveFolder.Newfolderpath)}>
            Move
          </Button>
        </ModalFooter>
      </Modal>
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
