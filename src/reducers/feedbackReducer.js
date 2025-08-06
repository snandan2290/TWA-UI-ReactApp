import {
  GET_ERROR,
  GET_ALL_FEEDBACK,
  FEEDBACK_RESOLVE_SUCCESSFULLY,
  FEEDBACK_ESCALATE_SUCCESSFULLY,
} from "../constants/actionTypes";

const initialState = {
  feedbackCount: 0,
  allFeedbacks: [],
  resolvedSuccessFully: false,
  escalateSuccessFully: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_FEEDBACK:
      return {
        ...state,
        allFeedbacks: action.payload.rows,
        feedbackCount: action.payload.count,
      };

    case FEEDBACK_RESOLVE_SUCCESSFULLY:
      return {
        ...state,
        resolvedSuccessFully: true,
      };

    case FEEDBACK_ESCALATE_SUCCESSFULLY:
      return {
        ...state,
        escalateSuccessFully: true,
      };

    case "RESET_FEEDBACK_FLAGS":
      return {
        ...state,
        resolvedSuccessFully: false,
        escalateSuccessFully: false,
      };

    case GET_ERROR:
      return {
        ...state,
        errorInProcessing: true,
      };

    default:
      return state;
  }
}
