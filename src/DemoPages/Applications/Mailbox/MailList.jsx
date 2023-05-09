import React, { Fragment, useEffect, useMemo, useState } from "react";
import "./mail.scss";
import {
  Button,
  Card,
  Nav,
  NavItem,
  DropdownMenu,
  InputGroup,
  Input,
  Table,
  UncontrolledButtonDropdown,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

import { Elastic } from "react-burgers";

import {
  faStar,
  faCalendarAlt,
  faSearch,
  faSyncAlt,
  faTrash,
  faShare,
  faChevronLeft,
  faChevronRight,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMailService } from "../../../services/mail.service";
import { connect } from "react-redux";
import { setAuthToken, setLoading } from "../../../reducers/Auth";
import { setMailFolderList, setSelectedFolder } from "../../../reducers/mail";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { DEBOUNCE_DELAY, emptyFilterOption, sortSelectOptions } from "../../../utils/constants";
import { SearchForm } from "./SearchForm";
import { useDebounce } from "../../../hooks/useDebounce";

const animatedComponents = makeAnimated();

const MailList = ({ token, selectedFolder, setLoading, mailFolderList }) => {
  const PAGE_LIMIT = 50;
  const [state, setState] = useState({
    active: false,
  });
  const [searchText, setSearchText] = useState("");
  const [mails, setMails] = useState([]);
  const [filteredMails, setFilteredMails] = useState([]);
  const mailService = useMailService(token);
  const [page, setPage] = useState(1);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedMails, setSelectedMails] = useState([]);
  const [sorting, setSorting] = useState({
    type: "",
    asce: true,
  });
  const [filterOptions, setFilterOptions] = useState(emptyFilterOption);

  const [openMoveFolder, setOpenMoveFolder] = useState({
    open: false,
    Newfolderpath: "",
  });

  const searchQuery = useDebounce(searchText, DEBOUNCE_DELAY);

  const handleSearchEmail = async (searchText) => {
    setPage(1);
    if (searchText) {
      const res = await mailService.searchEmail({
        ...emptyFilterOption,
        SearchWords: searchText,
      });
      setFilteredMails(res.emailLists);
    } else {
      setFilteredMails(mails);
    }
  };

  useEffect(() => {
    handleSearchEmail(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedFolder) {
      fetchMails(selectedFolder);
    }
  }, [selectedFolder]);

  const fetchMails = async (mailboxType) => {
    try {
      setLoading(true);
      const res = await mailService.getMails(mailboxType);
      setMails(res.emailLists);
      setFilteredMails(res.emailLists);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const perPageMails = useMemo(() => {
    const skip = (page - 1) * PAGE_LIMIT;
    const perPageFilterMails = filteredMails.slice(skip, skip + PAGE_LIMIT);
    if (sorting.type) {
      return perPageFilterMails.sort((a, b) => {
        if (sorting.asce) {
          return a[sorting.type].localeCompare(b[sorting.type], "en", { sensitivity: "base" });
        } else {
          return b[sorting.type].localeCompare(a[sorting.type], "en", { sensitivity: "base" });
        }
      });
    }
    return perPageFilterMails;
  }, [page, filteredMails, sorting]);

  const handleAllmailCheck = () => {
    setAllSelected((prev) => !prev);
  };

  const handleDeleteMails = async () => {
    try {
      if (!selectedMails.length) {
        return;
      }
      await mailService.deleteEmail(selectedMails);
      setSelectedMails([]);
      fetchMails(selectedFolder);
    } catch (e) {
      console.log("exception", e);
    }
  };

  const handleRefreshMails = async () => {
    try {
      fetchMails(selectedFolder);
    } catch (error) {
      console.log("Error with Refresh mails:", error);
    }
  };

  const handleSortingSelect = (value) => {
    if (value.value == sorting.type) {
      setSorting((prevVal) => ({
        ...prevVal,
        asce: !prevVal.asce,
      }));
    } else {
      setSorting({
        type: value.value,
        asce: true,
      });
    }
  };

  const openMoveMails = () => {
    if (!selectedMails.length) return;
    setOpenMoveFolder({
      open: true,
      Newfolderpath: "",
    });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const MailBoxControls = () => (
    <div className="app-inner-layout__top-pane pt-0 justify-content-between">
      <div className="d-flex ali">
        <Button outline className="control-button me-1" active color="light" onClick={handleAllmailCheck}>
          <Input type="checkbox" checked={allSelected} className={`form-check-input-custom`} label="&nbsp;" />
        </Button>
        <div className="btn-group">
          <Button outline className="control-button me-1" active color="light" onClick={handleDeleteMails}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>

        <Button outline className="control-button me-1" active color="light" onClick={handleRefreshMails}>
          <FontAwesomeIcon icon={faSyncAlt} />
        </Button>
        <Button outline className="control-button me-1" active color="light" onClick={openMoveMails}>
          Move Mails <FontAwesomeIcon icon={faShare}></FontAwesomeIcon>
        </Button>
        <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          defaultValue={sortSelectOptions.filter((option) => option.value == sorting.type)}
          onChange={handleSortingSelect}
          className={`react-sorting-select`}
          options={sortSelectOptions}
        />
      </div>
      <div className="d-flex align-items-center">
        <span className="me-1 fw-bolder">{`${(page - 1) * PAGE_LIMIT + 1}-${
          page * PAGE_LIMIT > filteredMails.length ? filteredMails.length : page * PAGE_LIMIT
        }/${filteredMails.length}`}</span>
        <div className="btn-group ml-1">
          <Button
            outline
            className="me-2"
            active
            color="light"
            type="button"
            onClick={() => {
              handlePageChange(page - 1);
            }}
            // className="btn btn-default btn-sm"
            disabled={page < 2}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <Button
            outline
            className="me-2"
            active
            color="light"
            onClick={() => {
              handlePageChange(page + 1);
            }}
            type="button"
            // className="btn btn-default btn-sm"
            disabled={(filteredMails.length % 50 == 0 ? page + 1 : page) * PAGE_LIMIT > filteredMails.length}
          >
            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
          </Button>
        </div>
      </div>
    </div>
  );

  const handleSearch = async () => {
    if (Object.values(filterOptions).every((item) => item == "")) {
      setFilteredMails(mails);
    } else {
      const res = await mailService.searchEmail(filterOptions);
      setFilteredMails(res.emailLists);
    }
  };

  const handleCloseMoveMail = () => {
    setOpenMoveFolder({
      open: false,
      Newfolderpath: "",
    });
  };

  const handleMailCheckBox = (e, id, FolderName) => {
    if (e?.target?.checked) {
      setSelectedMails((prevVal) => [...prevVal, { Msgnum: id, MailFolderName: FolderName }]);
    } else {
      setSelectedMails((prevVal) => [...prevVal.filter((mail) => mail.Msgnum !== id)]);
    }
  };

  return (
    <Fragment>
      <Card className="app-inner-layout__content">
        <div>
          <div className="app-inner-layout__top-pane">
            <div className="pane-left">
              <div className="mobile-app-menu-btn">
                <Elastic
                  width={26}
                  lineHeight={2}
                  lineSpacing={5}
                  color="#6c757d"
                  active={state.active}
                  onClick={() => setState((prevVal) => ({ ...prevVal, active: state.active }))}
                />
              </div>
              <h4 className="mb-0">{searchText || !Object.values(filterOptions).every((item) => item == "") ? "Seach Result" : selectedFolder}</h4>
            </div>
            <div className="pane-right">
              <InputGroup>
                <div className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </div>
                <Input
                  placeholder="Search..."
                  name="SearchWords"
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                />
              </InputGroup>
              <UncontrolledButtonDropdown>
                <DropdownToggle color="link">
                  <FontAwesomeIcon icon={faFilter} />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-xl rm-pointers">
                  <SearchForm filterOptions={filterOptions} setFilterOptions={setFilterOptions} />
                  <Nav vertical>
                    <NavItem className="nav-item-divider" />
                    <NavItem className="nav-item-btn text-center">
                      <Button size="sm" className="btn-shadow" color="primary" onClick={handleSearch}>
                        Search
                      </Button>
                    </NavItem>
                  </Nav>
                </DropdownMenu>
              </UncontrolledButtonDropdown>
            </div>
          </div>
          <MailBoxControls />
          <div className="bg-white">
            <Table responsive className="text-nowrap table-lg mb-0" hover>
              <tbody>
                {!perPageMails.length ? (
                  <div className="d-flex justify-content-center font-weight-bold">No Data Found</div>
                ) : (
                  perPageMails?.map((mail, index) => (
                    <tr key={`mail-container-${mail.MSGNUM}-${index}`}>
                      <td className="text-center" style={{ width: "78px" }}>
                        <Input
                          type="checkbox"
                          onChange={(e) => handleMailCheckBox(e, mail.MSGNUM, mail.FolderName)}
                          checked={selectedMails.filter((item) => item.Msgnum == mail.MSGNUM).length > 0}
                          className="form-check-input-custom"
                          id="eCheckbox1"
                          label="&nbsp;"
                        />
                      </td>
                      <td className="text-start ps-1">
                        <FontAwesomeIcon icon={faStar} />
                      </td>
                      <td>
                        <div className="widget-content p-0">
                          <div className="widget-content-wrapper">
                            {/* <div className="widget-content-left me-3">
                                    <img width={42} className="rounded-circle" src={avatar1} alt="" />
                                  </div> */}
                            <div className="widget-content-left">
                              <div className="widget-heading">{mail.FROMMAIL}</div>
                              {/* <div className="widget-subheading">Last seen online 15 minutes ago</div> */}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-start mail-subject-wrapper">
                        <span className="mail-subject">{mail.SUBJECT}</span>
                      </td>
                      {/* <td>
                                  <FontAwesomeIcon className="opacity-4" icon={faTags} />
                                </td> */}
                      <td className="text-end">
                        <FontAwesomeIcon className="opacity-4 me-2" icon={faCalendarAlt} />
                        {mail.RecieveDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <div className="app-inner-layout__bottom-pane d-block text-center"></div>
          </div>
        </div>
      </Card>

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
              onChange={(e) => setOpenMoveFolder((prevVal) => ({ ...prevVal, Newfolderpath: e.target.value }))}
              closeMenuOnSelect={true}
              components={animatedComponents}
              defaultValue={openMoveFolder.Newfolderpath}
              // onChange={handleSortingSelect}
              className={`react-sorting-select`}
              options={mailFolderList}
            >
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="link" onClick={handleCloseMoveMail}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleCloseMoveMail}>
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

export default connect(mapStateToProps, mapDispatchToProps)(MailList);
