export const SET_SELECTED_FOLDER = "SET_SELECTED_FOLDER";

export const setSelectedFolder = (selectedFolder) => ({
  type: SET_SELECTED_FOLDER,
  selectedFolder,
});

const initialState = {
  selectedFolder: "Deleted Items",
};

export default function mailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_FOLDER:
      return {
        ...state,
        selectedFolder: action.selectedFolder,
      };

    default:
  }
  return state;
}
