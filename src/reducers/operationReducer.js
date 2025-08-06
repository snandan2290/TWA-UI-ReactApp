import {
  GET_ERROR,
  GET_ALL_OPERATIONS,
  SAVE_OPERATION_SUCCESSFULLY,
  GOT_GI_FILE_URL,
  OPERATION_DELETE_SUCCESSFULLY
} from "../constants/actionTypes";

const initialState = {
  operationsCount: 0,
  allOperations: [],
  saveOperationSuccessFully: false,
  deleteOperationSuccessFully: false,
  errorInProcessing: "",
  fileUrlGI: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_OPERATIONS:
      return {
        allOperations: action.payload.rows,
        operationsCount: action.payload.count
      };

    case SAVE_OPERATION_SUCCESSFULLY:
      return {
        ...state,
        saveOperationSuccessFully: true
      };
    case OPERATION_DELETE_SUCCESSFULLY:
      return {
        ...state,
        deleteOperationSuccessFully: true
      };

    case GOT_GI_FILE_URL:
      return {
        ...state,
        fileUrlGI: action.payload
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
