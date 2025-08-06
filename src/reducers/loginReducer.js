import { SET_CURRENT_USER , GET_ERROR , OPERATOR_ISNOT_ADMIN_ERROR, CLEAR_AUTH_ERRORS ,CLEAR_PASSWORD_RESET_ERROR,RESET_PASSWORD_SUCCESS} from "../constants/actionTypes";
import isEmpty from "../validation/isEmpty";

const initialState = {
  isAuthenticated: false,
  errorInProcessing:false,
  user: {},
  operatorAuthError:false
};

function loginReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
      case OPERATOR_ISNOT_ADMIN_ERROR:
      return {
        ...state,
        operatorAuthError: true
      };
      case CLEAR_AUTH_ERRORS:
        return {
          ...state,
          errorInProcessing: false,
          operatorAuthError: false
        };
        case CLEAR_PASSWORD_RESET_ERROR:
        return {
          ...state,
          errorInProcessing: false,
          operatorAuthError: false
        };
        case RESET_PASSWORD_SUCCESS:
  return {
    ...state,
    errorInProcessing: false,
    error: null
  };
      case GET_ERROR:
      return {
        ...state,
        errorInProcessing: true
      };
    default:
      return state;
  }
}

export default loginReducer;
