import axios from "axios";
import {
  GET_ALL_WORK_ORDERS,
  GET_WORK_ORDER,
  GET_ERROR,
  ASSIGN_GET_WORK_ORDER,
  GET_VARIANTS,
  GET_ASSEMBLY_LINE,
  SAVE_WORK_ORDER_SUCCESS,
  UPLOAD_WORK_ORDER_SUCCESS,
  MARK_COMPLETE_DELETE_WORK_ORDER_SUCCESS,
  MARK_ALL_WORK_ORDER_AS_COMPLETE,
  GET_ALL_FEEDBACK,
  FEEDBACK_RESOLVE_SUCCESSFULLY,
  FEEDBACK_ESCALATE_SUCCESSFULLY,
} from "./../constants/actionTypes";

//get all work orders
export const getAllWorkOrder =
  (locationId, pageNumber, pageSize, searchParam) => (dispatch) => {
    if (searchParam === null || searchParam === "") {
      searchParam = undefined;
    }
    axios
      .get(
        `/getWorkOrdersByLocation/${locationId}/${pageNumber}/${pageSize}/${searchParam}`
      )
      .then((res) =>
        dispatch({
          type: GET_ALL_WORK_ORDERS,
          payload: res.data.data,
        })
      )
      .catch((error) =>
        dispatch({
          type: GET_ERROR,
          payload: error,
        })
      );
  };

//get individual work order by 1
export const getWorkOrder = (locationId) => (dispatch) => {
  axios
    .get(`/getWorkOrdersByLocation/${locationId}`)
    .then((res) =>
      dispatch({
        type: GET_WORK_ORDER,
        payload: res.data.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//edit worpk order
export const editWorkOrder = (locationId, workOrderData) => (dispatch) => {
  axios
    .get(`/getWorkOrdersByLocation/${locationId}`)
    .then((res) => dispatch({}))
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//assignWorkOrder
export const assignGetWorkOrder = () => (dispatch) => {
  axios
    .get(`/getOpenWorkOrders`)
    .then((res) =>
      dispatch({
        type: ASSIGN_GET_WORK_ORDER,
        payload: res.data.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//varient
export const getVariants = () => (dispatch) => {
  axios
    .get(`/getAllVariants`)
    .then((res) =>
      dispatch({
        type: GET_VARIANTS,
        payload: res.data.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//Get List of Assembly Line by Location

export const getAssemblyLine = (locationId) => (dispatch) => {
  axios
    .get(`/getAssemblyLinesByLocation/${locationId}`)
    .then((res) =>
      dispatch({
        type: GET_ASSEMBLY_LINE,
        payload: res.data.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//save work order

export const saveWorkOrderDetails = (workOrderData) => (dispatch) => {
  axios
    .post(`/saveWorkOrderDetails`, workOrderData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: SAVE_WORK_ORDER_SUCCESS,
          payload: null,
        });
      } else {
        dispatch({
          type: GET_ERROR,
          payload: null,
        });
      }
    })
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error.response,
      })
    );
};

//Delete or Marke Complete work order

export const markCompleteDeleteWorkOrderDetails =
  (workOrderData) => (dispatch) => {
    axios
      .post(`/updateWorkOrders`, workOrderData)
      .then((res) => {
        if (res.data.status === "success") {
          dispatch({
            type: MARK_COMPLETE_DELETE_WORK_ORDER_SUCCESS,
            payload: null,
          });
        } else {
          dispatch({
            type: GET_ERROR,
            payload: null,
          });
        }
      })
      .catch((error) =>
        dispatch({
          type: GET_ERROR,
          payload: error,
        })
      );
  };

//Mark All work orders as Complete

export const markAllWorkOrdersAsComplete = () => (dispatch) => {
  axios
    .post(`/markAllWorkOrderAsComplete`)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: MARK_ALL_WORK_ORDER_AS_COMPLETE,
          payload: res.data.data,
        });
      } else {
        dispatch({
          type: GET_ERROR,
          payload: null,
        });
      }
    })
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//upload work order file
export const uploadWorkOrderFile = (workOrderFile) => (dispatch) => {
  axios
    .post(`/uploadWorkOrders`, workOrderFile)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: UPLOAD_WORK_ORDER_SUCCESS,
          payload: res.data.data,
        });
      } else {
        dispatch({
          type: GET_ERROR,
          payload: null,
        });
      }
    })
    .catch((error) => {
      dispatch({
        type: GET_ERROR,
        payload: error,
      });
    });
};

//feedback --------------------------------- feedback Api------------------------------

export const getAllfeedback =
  (locationId, pageNumber, pageSize, searchParam) => (dispatch) => {
    if (searchParam === null || searchParam === "") {
      searchParam = undefined;
    }
    axios
      .get(
        `/getFeedbacksByLocation/${locationId}/${pageNumber}/${pageSize}/${searchParam}`
      )
      .then((res) =>
        dispatch({
          type: GET_ALL_FEEDBACK,
          payload: res.data.data,
        })
      )
      .catch((error) =>
        dispatch({
          type: GET_ERROR,
          payload: error,
        })
      );
  };

export const feedbackResolve = (resolveData) => (dispatch) => {
  axios
    .post(`/resolveFeedback`, resolveData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: FEEDBACK_RESOLVE_SUCCESSFULLY,
          payload: null,
        });
      } else {
        dispatch({
          type: GET_ERROR,
          payload: null,
        });
      }
    })
    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};
export const feedbackEscalate = (escalateData) => (dispatch) => {
  return axios
    .post(`/escalateFeedback`, escalateData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: FEEDBACK_ESCALATE_SUCCESSFULLY,
          payload: null,
        });
      } else {
        dispatch({
          type: GET_ERROR,
          payload: null,
        });
      }
      return res;
    })
    .catch((error) => {
      dispatch({
        type: GET_ERROR,
        payload: error,
      });
      throw error;
    });
};

export const resetFeedbackFlags = () => ({
  type: "RESET_FEEDBACK_FLAGS",
});