import { useEffect, useRef } from "react";

import BaseService from "./base.service";

export function useMailService(token) {
  let mailService = useRef(new MailServices(token));
  useEffect(() => {
    mailService.current = new MailServices(token);
  }, [token]);

  return mailService.current;
}

class MailServices extends BaseService {
  constructor(token) {
    super(token);
  }

  getMailFolders = async () =>
    await this._callApi("POST", "/api/Login/GetMailFolderList", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
    });

  getMails = async (mailboxType) =>
    await this._callApi("POST", "/api/Login/GetMailList", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      MailboxType: mailboxType,
    });

  getMessageDetails = async (msgNum, folderName) =>
    await this._callApi("POST", "/api/Login/GetMessageDetails", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      Msgnum: msgNum,
      FolderName: folderName,
    });

  deleteEmail = async (mails) =>
    await this._callApi("POST", "/api/Login/DeleteEmail", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      delEmailLists: mails,
    });

  searchEmail = async (searchOptions) =>
    await this._callApi("POST", "/api/Login/FilterEmails", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      ...searchOptions,
    });

  autoFillEmail = async (text) =>
    await this._callApi("POST", "/api/Login/GetAutoFillTo_CC", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      SearchKeyword: text,
    });

  sendEmail = async (body) =>
    await this._callApi("POST", "/api/Login/SendEmail", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      ...body,
    });

  getHtmlContent = async (filepath) =>
    await this._callApi("POST", "/api/Login/ViewhtmlBody", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      Filepath: filepath,
    });

  createMailFolder = async (Folderpath) =>
    await this._callApi("POST", "/api/Login/CreateMailFolder", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      Folderpath,
    });

  deleteMailFolder = async (Folderpath) =>
    await this._callApi("POST", "/api/Login/DeleteMailFolder", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      Folderpath,
    });

  moveMailFolder = async (Oldfolderpath, Newfolderpath) =>
    await this._callApi("POST", "/api/Login/MoveMailFolder", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      Oldfolderpath,
      Newfolderpath
    });

  shiftMail = async (mails) =>
    await this._callApi("POST", "/api/Login/ShiftEmail", undefined, {
      Userid: "abhinav.singh@dayibpl.com",
      shiftmaillist: mails
    });
}
