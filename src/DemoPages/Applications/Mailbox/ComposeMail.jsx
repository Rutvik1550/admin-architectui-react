import { faEnvelope, faPaperclip, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useState } from "react";
import { Button, Card } from "reactstrap";
import { useMailService } from "../../../services/mail.service";
import { useHistory } from "react-router-dom";
import MultiSelect from "./MultiSelect";
import RichTextEditor from "react-rte";

// const toolbarConfig = {
//   // Optionally specify the groups to display (displayed in the order listed).
//   display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
//   INLINE_STYLE_BUTTONS: [
//     {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
//     {label: 'Italic', style: 'ITALIC'},
//     {label: 'Underline', style: 'UNDERLINE'}
//   ],
//   BLOCK_TYPE_DROPDOWN: [
//     {label: 'Normal', style: 'unstyled'},
//     {label: 'Heading Large', style: 'header-one'},
//     {label: 'Heading Medium', style: 'header-two'},
//     {label: 'Heading Small', style: 'header-three'}
//   ],
//   BLOCK_TYPE_BUTTONS: [
//     {label: 'UL', style: 'unordered-list-item'},
//     {label: 'OL', style: 'ordered-list-item'}
//   ]
// };

const ComposeMail = (props) => {
  const { token } = props;
  const [mailDetails, setMailDetails] = useState({
    BodyText: RichTextEditor.createEmptyValue()
  });
  const [openCC, setOpenCC] = useState(false);
  const mailService = useMailService(token);
  const [Attachments, setAttachments] = useState([]);
  const history = useHistory();

  const handleChangeSummernote = (content) => {
    console.log("content", content.toString("html"), mailDetails.BodyText)
    setMailDetails((prevVal) => ({
      ...prevVal,
      BodyText: content,
    }));
  };

  const handleChange = (value, name) => {
    if (name) {
      setMailDetails((prevVal) => ({
        ...prevVal,
        [name]: value,
      }));
    }
  };

  const handleCCOpen = () => {
    setOpenCC((prev) => !prev);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name) {
      setMailDetails((prevVal) => ({
        ...prevVal,
        [name]: value,
      }));
    }
  };

  const handleSubmitMail = async () => {
    try {
      const res = await mailService.sendEmail({
        ...mailDetails,
        Attachments: Attachments,
      });
      if (res == "Sent") {
        history.push('/apps/mailbox')
      }
    } catch (error) {
      console.log("Error with submit mail: ", error);
    }
  };

  const handleFileSelect = async (event) => {
    const { files: tempFiles } = event.target;
    const files = [...tempFiles];
    if (files?.length) {
      const tempAttachment = [];
      for await (const file of files) {
        function getFile() {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
              const result = {
                id: Attachments.length ? Attachments[Attachments.length - 1].id + 1 : Math.floor(Math.random() * 100000),
                Filename: file["name"],
                ContentType: file["type"],
                base64string: reader.result,
              };
              resolve(result);
            };
            reader.onerror = function (error) {
              console.log("Error: ", error);
              reject();
            };
          });
        }

        const base64File = await getFile();
        tempAttachment.push(base64File);
      }

      setAttachments([...Attachments, ...tempAttachment]);
    }
  };

  const handleRemoveFile = (id) => {
    setAttachments((prevVal) => prevVal.filter((file) => file.id !== id));
  };

  const handleDiscardMail = () => {
    history.push('/apps/mailbox')
  }

  return (
    <Fragment>
      <Card className="app-inner-layout__content">
        <div className="card card-primary card-outline">
          <div className="card-header">
            <h3 className="card-title">Compose New Message</h3>
          </div>

          <div className="card-body">
            <div className="form-group d-flex mb-3">
              <div className="input-group d-flex flex-nowrap">
                <MultiSelect name={"To"} onChange={handleChange} />
                <button className="btn btn-secondary float-right ml-2 pt-0 pb-0" onClick={handleCCOpen}>
                  CC
                </button>
              </div>
            </div>
            {openCC && (
              <>
                <div className="form-group">
                  <div className="input-group mb-3 d-flex flex-nowrap">
                    <MultiSelect name={"CC"} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group mb-3 d-flex flex-nowrap">
                    <MultiSelect name={"BCC"} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}
            <div className="form-group mb-3">
              <input className="form-control" placeholder="Subject:" name="Subject" onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <RichTextEditor
                value={mailDetails.BodyText ?? ""}
                onChange={handleChangeSummernote}
                editorStyle={{
                  minHeight: 200
                }}
                // toolbarConfig={toolbarConfig}
              />
              {/* <ReactSummernote
                options={{
                  disableDragAndDrop: false,
                  height: 200,
                  toolbar: [
                    ["style", ["style"]],
                    ["font", ["bold", "underline", "clear"]],
                    ["fontname", ["fontname"]],
                    ["color", ["color", "#ffffff"]],
                    ["para", ["ul", "ol", "paragraph"]],
                    ["table", ["table"]],
                    ["insert", ["link", "picture", "video"]],
                    ["view", ["fullscreen", "codeview"]],
                  ],
                }}
                onChange={handleChangeSummernote}
              /> */}
            </div>
            <div className="form-group">
              <div className="btn btn-default btn-file">
                <FontAwesomeIcon className="fas fa-paperclip" icon={faPaperclip} /> Attachment
                <input type="file" name="attachment" onChange={handleFileSelect} multiple />
              </div>
              <div className="files-container">
                {Attachments?.map((file, index) => (
                  <div className="file-wrapper" key={`selected-files-${file.id}-${index}`}>
                    <span>{file.Filename}</span>
                    <FontAwesomeIcon className="fa-solid fa-xmark" icon={faTimes} onClick={() => handleRemoveFile(file.id)} />
                  </div>
                ))}
              </div>
              <p className="help-block">Max. 25MB</p>
            </div>
          </div>

          <div className="card-footer">
            <div className="float-right me-2">
              <button type="submit" className="btn btn-primary ml-2" onClick={handleSubmitMail}>
                <FontAwesomeIcon className="far fa-envelope" icon={faEnvelope} /> Send
              </button>
            </div>
            <Button type="reset" className="btn btn-default" onClick={handleDiscardMail}>
              <FontAwesomeIcon className="fas fa-times" icon={faTimes} /> Discard
            </Button>
          </div>
        </div>
      </Card>
    </Fragment>
  );
};

export default ComposeMail;
