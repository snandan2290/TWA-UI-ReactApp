import {
  GET_ALL_USER,
  GET_ERROR,
  GET_ALL_USER_LOCATION_LIST,
  SAVE_SUCCESSFULLY,
  DELETE_USER_SUCCESSFULLY,
  RESET_PASSWORD_SUCCESS
} from "../constants/actionTypes";

const initialState = {
  count: 0,
  allUsers: [],
  location: [],
  saveSuccessFully: false,
  errorInProcessing: "",
  DeleteSuccess: false,
  resetPasswordSucceessfully:false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USER:
      return {
        allUsers: action.payload.rows,
        count: action.payload.count
      };

    case GET_ALL_USER_LOCATION_LIST:
      return {
        ...state,
        location: action.payload
      };

    case SAVE_SUCCESSFULLY:
      return {
        ...state,
        saveSuccessFully: true
      };

    case DELETE_USER_SUCCESSFULLY:
      return {
        ...state,
        DeleteSuccess: true
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        resetPasswordSucceessfully: true
      };

    case GET_ERROR:
      return {
        ...state,
        errorInProcessing: action.payload
      };

    default:
      return state;
  }
}
