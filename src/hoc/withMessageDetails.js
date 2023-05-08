import React, { useEffect, useState } from "react";

import Loader from "../components/Loader";
import { useAuthContext } from "../context/auth";
import { useMailService } from "../services/mail.service";
import { useParams } from "react-router";
import { useSearchParams, useNavigate } from "react-router-dom";
import withLoader from "./withLoader";

const withMessageDetails = (WrappedComponent) => {
  return function WithMessageDetailsComponent({ ...props }) {
    const authContext = useAuthContext();
    const mailService = useMailService(authContext.token);
    const [loading, setLoading] = useState(false);
    const [messageDetails, setMessageDetails] = useState();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [htmlContent, setHtmlContent] = useState("");
    const [viewAsHtml, setViewAsHtml] = useState(false);
    const navigate = useNavigate()

    const WrappedComponentWithLoading = withLoader(WrappedComponent, Loader);

    useEffect(() => {
      console.log('sdfsdf')
      const folder = searchParams.get("folder");
      if (id && folder) {
        fetchMessageDetails(id, folder);
      } else {
        navigate('/mailbox')
      }
    }, [id, searchParams]);

    useEffect(() => {
      if (viewAsHtml && messageDetails && !htmlContent) {
        fetchHtmlContent(messageDetails.HtmlBodyPath);
      }
    }, [viewAsHtml]);

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

    return (
      <WrappedComponentWithLoading
        loading={loading}
        messageDetails={messageDetails}
        viewAsHtml={viewAsHtml}
        setViewAsHtml={setViewAsHtml}
        htmlContent={htmlContent}
      />
    );
  };
};

export default withMessageDetails;
