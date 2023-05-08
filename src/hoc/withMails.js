import React, { useEffect, useState } from "react";
import { setAuthToken } from "../reducers/Auth";
import { connect } from "react-redux";

// import Loader from "../components/Loader";
// import { useAuthContext } from "../context/auth";
// import { useMailContext } from "../context/mail";
// import { useMailService } from "../services/mail.service";
// import withLoader from "./withLoader";

const withMails = (WrappedComponent) => {
  console.log("WrappedComponent",WrappedComponent)
  // return function WithMailsComponent() {
  //   const authContext = useAuthContext();
  //   const mailContext = useMailContext();
  //   const mailService = useMailService(authContext.token);
  //   const [loading, setLoading] = useState(false);
  //   const [mails, setMails] = useState([]);

  //   const WrappedComponentWithLoading = withLoader(WrappedComponent, Loader);

  //   useEffect(() => {
  //     if (mailContext.selectedFolder) {
  //       fetchMails(mailContext.selectedFolder);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [mailContext.selectedFolder]);

  //   const fetchMails = async (mailboxType) => {
  //     try {
  //       setLoading(true);
  //       const res = await mailService.getMails(mailboxType);
  //       setMails(res.emailLists);
  //     } catch (err) {
  //       console.log("Error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   return <WrappedComponentWithLoading loading={loading} mails={mails} fetchMails={fetchMails} selectedFolder={mailContext.selectedFolder} mailService={mailService} />;
  // };
};

const mapStateToProps = state => ({
  token: state.authReducer.token,
})

const mapDispatchToProps = dispatch => ({
  setAuthToken: token => dispatch(setAuthToken(token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withMails);
