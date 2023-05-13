import React, { Fragment, useRef } from "react";
import { useMailService } from "../../../services/mail.service";
import { useLocation } from "react-router-dom";
import { Button, Card } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudDownloadAlt, faFile, faPaperclip, faPrint, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function MailDetails(props) {
  const { messageDetails, viewAsHtml, setViewAsHtml, htmlContent, token, setIsReadMail } = props;
  const mailService = useMailService(token);
  const mailRef = useRef();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const handleClickToggle = () => {
    setViewAsHtml((prev) => !prev);
  };

  const handleDeleteMail = async () => {
    try {
      const FolderName = searchParams.get("folder");
      const id = searchParams.get("id");
      const payload = {
        Msgnum: id,
        MailFolderName: FolderName,
      };
      const res = await mailService.deleteEmail([payload]);
      if (res === "Success") {
        setIsReadMail(false);
      }
    } catch (error) {
      console.log("Error with Delete mail.", error);
    }
  };

  const handlePrintmail = () => {
    let printContents = mailRef.current.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <Fragment>
      <Card className="app-inner-layout__content">
        <div className="card card-primary card-outline" ref={mailRef}>
          <div className="card-header">
            <h3 className="card-title">Read Mail</h3>
            <span className="ms-3 mb-2 cursor-pointer nav-link" onClick={handleClickToggle}>
              {viewAsHtml ? "View As Text" : "View As Html"}
            </span>
          </div>

          <div className="card-body p-0">
            <div className="mailbox-read-info">
              <h5>{messageDetails.Subject}</h5>
              <h6>
                From: {messageDetails.FromMail}
                <span className="mailbox-read-time float-right">{messageDetails.RecieveDate}</span>
              </h6>
            </div>

            <div className="mailbox-read-message" dangerouslySetInnerHTML={{ __html: viewAsHtml ? htmlContent : messageDetails.TextBody }}></div>
          </div>

          {messageDetails?.Attachments?.length > 0 && (
            <div className="card-footer bg-white">
              <ul className="mailbox-attachments d-flex align-items-stretch clearfix overflow-auto">
                {messageDetails?.Attachments.map((attachment, index) => {
                  return (
                    <li key={index}>
                      <span className="mailbox-attachment-icon">
                        <FontAwesomeIcon icon={faFile} />
                      </span>

                      <div className="mailbox-attachment-info">
                        <a href={attachment?.DownloadURL} className="mailbox-attachment-name">
                          <FontAwesomeIcon icon={faPaperclip} /> {attachment?.Filename}
                        </a>
                        <span className="mailbox-attachment-size clearfix mt-1">
                          <span>1,245 KB</span>
                          <a href={attachment?.DownloadURL} className="btn btn-default btn-sm float-right">
                            <FontAwesomeIcon icon={faCloudDownloadAlt} />
                          </a>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="card-footer">
            <Button type="button" className="btn btn-default me-2" onClick={handleDeleteMail}>
              <FontAwesomeIcon icon={faTrashAlt} /> Delete
            </Button>
            <Button type="button" className="btn btn-default" onClick={handlePrintmail}>
              <FontAwesomeIcon icon={faPrint} /> Print
            </Button>
          </div>
        </div>
      </Card>
    </Fragment>
  );
}

export default MailDetails;
