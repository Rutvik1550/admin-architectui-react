import React, { Fragment, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./mail.scss";

import cx from "classnames";

import PageTitle from "../../../Layout/AppMain/PageTitle";
import MailList from "./MailList";
import FolderList from "./FolderList";
import { useLocation } from "react-router-dom";
import MailDetails from "./MailDetails";
import { connect } from "react-redux";
import { setAuthToken, setLoading } from "../../../reducers/Auth";
import { setMailFolderList, setSelectedFolder } from "../../../reducers/mail";
import { useMailService } from "../../../services/mail.service";
import ComposeMail from "./ComposeMail";

const Mailbox = (props) => {
  const { token } = props;
  const [state, setState] = useState({
    active: false,
  });
  const mailService = useMailService(token);
  const location = useLocation();
  const [messageDetails, setMessageDetails] = useState({});
  const searchParams = new URLSearchParams(location.search);
  const [isReadMail, setIsReadMail] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [viewAsHtml, setViewAsHtml] = useState(false);
  const [ createNew, setCreateNew ] = useState(false)
  const folder = searchParams.get("folder");
  const id = searchParams.get("id");
  const create = searchParams.get("create");

  useEffect(() => {
    if (id && folder) {
      setIsReadMail(true);
      fetchMessageDetails(id, folder);
    } else {
      setIsReadMail(false);
    }

    if(create === "new-mail") {
      setCreateNew(true);
    } else {
      setCreateNew(false)
    }
  }, [folder, id, create]);

  useEffect(() => {
    if (viewAsHtml && messageDetails && !htmlContent) {
      fetchHtmlContent(messageDetails.HtmlBodyPath);
    }
  }, [viewAsHtml]);

  const fetchHtmlContent = async (filepath) => {
    try {
      setLoading(true);
      const res = await mailService.getHtmlContent(filepath);
      setHtmlContent(res.HtmlString);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessageDetails = async (msgNum, folderName) => {
    try {
      setLoading(true);
      const res = await mailService.getMessageDetails(msgNum, folderName);
      setMessageDetails(res);
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" classNames="TabsAnimation" appear={true} timeout={1500} enter={false} exit={false}>
          <div>
            <div
              className={cx("app-inner-layout TabsAnimation", {
                "open-mobile-menu": state.active,
              })}
            >
              <div className="app-inner-layout__header bg-heavy-rain">
                <PageTitle
                  heading="Mailbox Layout Example"
                  subheading="Create stunning UIs for your pages with these layout components."
                  icon="pe-7s-power icon-gradient bg-mixed-hopes"
                />
              </div>
              <div className="app-inner-layout__wrapper">
                {isReadMail ? (
                  <MailDetails messageDetails={messageDetails} viewAsHtml={viewAsHtml} setViewAsHtml={setViewAsHtml} htmlContent={htmlContent} setIsReadMail={setIsReadMail} token={token} />
                ) : createNew ? (
                  <ComposeMail token={token} />
                ) : (
                  <MailList />
                )}
                <FolderList />
              </div>
            </div>
          </div>
        </CSSTransition>
      </TransitionGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(Mailbox);
