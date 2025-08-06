import axios from "axios";
import { SET_CURRENT_USER, GET_ERROR , RESET_PASSWORD_SUCCESS , OPERATOR_ISNOT_ADMIN_ERROR, CLEAR_AUTH_ERRORS,CLEAR_PASSWORD_RESET_ERROR} from "../constants/actionTypes";
import setAuthToken from "../utils/setAuthToken";

export const login = userData => dispatch => {
  axios
    .post("/login", userData)
    .then(res => {
      const token = res.data.token;
      const user = res.data.data[0];
      if(user.role === "Operator" && user.isAdmin === false){
        dispatch({
          type: OPERATOR_ISNOT_ADMIN_ERROR,
          payload: null
        })
      }else{
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("user", JSON.stringify(user));
  
        let localToken = localStorage.getItem("jwt_token");
        let localUser = localStorage.getItem("user");
  
        setAuthToken(localToken);
        dispatch(setCurrentUser(JSON.parse(localUser)));
      }
    })
    .catch(error =>
      dispatch({
        type: GET_ERROR,
        payload: null
      })
    );
};

export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  };
};

export const logOutUser = () => dispatch => {
  //remove token from localhost
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user");
  localStorage.removeItem("adminSelectedTab");
  //remove header
  setAuthToken(false);
  //set current user is {}
  dispatch(setCurrentUser({}));
  dispatch({ type: CLEAR_AUTH_ERRORS });
};

export const changePassword = (userData, history) => dispatch => {
  axios
    .post(`/saveUserDetails`, userData)
    .then(res => {
      if (res.data.status === "success") {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
          payload: null
        });
        dispatch({
          type: CLEAR_PASSWORD_RESET_ERROR,
          payload: null
        });
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user");
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("adminSelectedTab");
        //remove header
        setAuthToken(false);
        //set current user is {}
        dispatch(setCurrentUser({}));
       
      } else {
        dispatch({
          type: GET_ERROR,
          payload: null
        });
      }
    })
    .catch(error =>
      dispatch({
        type: GET_ERROR,
        payload: error
      })
    );
};


export const resetPassword = (id) => dispatch => {
  axios
    .post(`/resetPassword`, id)
    .then(res =>{
      if (res.data.status === "success") {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
          payload: null
        });
      } else {
        dispatch({
          type: GET_ERROR,
          payload: null
        });
       
      }
    })
    .catch(error =>
      dispatch({
        type: GET_ERROR,
        payload: error
      })
    );
};