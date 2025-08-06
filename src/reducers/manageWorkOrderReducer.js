import {
  GET_ALL_WORK_ORDERS,
  ASSIGN_GET_WORK_ORDER,
  GET_VARIANTS,
  SET_PAGE_CHANGE,
  GET_ASSEMBLY_LINE,
  SAVE_WORK_ORDER_SUCCESS,
  UPLOAD_WORK_ORDER_SUCCESS,
  GET_ERROR,
  MARK_COMPLETE_DELETE_WORK_ORDER_SUCCESS,
  MARK_ALL_WORK_ORDER_AS_COMPLETE
} from "../constants/actionTypes";

const initialState = {
  loading: false,
  count: 0,
  allWorkOrder: [],
  assignWorkOrder: [],
  variants: [],
  assemblyLine: [],
  setPageChange: {},
  saveWorkOrderSuccess: false,
  markCompleteDeleteSuccess: false,
  errorInProcessing: "",
  uploadWorkOrderSuccess: "",
  markAllWorkOrderAsComplete: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_WORK_ORDERS:
      return {
        allWorkOrder: action.payload.rows,
        count: action.payload.count
      };
    case ASSIGN_GET_WORK_ORDER:
      return {
        ...state,
        assignWorkOrder: action.payload
      };
    case GET_VARIANTS:
      return {
        ...state,
        variants: action.payload
      };
    case GET_ASSEMBLY_LINE:
      return {
        ...state,
        assemblyLine: action.payload
      };

    case SET_PAGE_CHANGE:
      return {
        ...state,
        setPageChange: action.payload
      };

    case SAVE_WORK_ORDER_SUCCESS:
      return {
        ...state,
        saveWorkOrderSuccess: true
      };
    case MARK_COMPLETE_DELETE_WORK_ORDER_SUCCESS:
      return {
        ...state,
        markCompleteDeleteSuccess: true
      };
    case UPLOAD_WORK_ORDER_SUCCESS:
      return {
        ...state,
        uploadWorkOrderSuccess: action.payload
      };
    case MARK_ALL_WORK_ORDER_AS_COMPLETE:
      return {
        ...state,
        markAllWorkOrderAsComplete: action.payload
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
