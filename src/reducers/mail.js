export const SET_SELECTED_FOLDER = "SET_SELECTED_FOLDER";
export const SET_MAIL_FOLDER_LIST = "SET_MAIL_FOLDER_LIST";

export const setSelectedFolder = (selectedFolder) => ({
  type: SET_SELECTED_FOLDER,
  selectedFolder,
});

export const setMailFolderList = (mailFolderList) => ({
  type: SET_MAIL_FOLDER_LIST,
  mailFolderList,
});

const initialState = {
  selectedFolder: "Deleted Items",
  mailFolderList: []
};

export default function mailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_FOLDER:
      return {
        ...state,
        selectedFolder: action.selectedFolder,
      };
  
    case SET_MAIL_FOLDER_LIST:
      return {
        ...state,
        mailFolderList: action.mailFolderList,
      };

    default:
  }
  return state;
}
