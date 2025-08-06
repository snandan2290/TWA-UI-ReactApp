import axios from "axios";
import {
  GET_ALL_COMPONENTS,
  GET_ERROR,
  SAVE_SUCCESSFULLY,
  GET_ALL_VARIANTS,
  GET_ALL_SOP,
  GET_ALL_OPERATIONS,
  GET_ALL_LOCATIONS,
  GET_COMPONENT_IMAGE_BY_ID,
  GET_ALL_COMPONENTS_FOR_DROPDOWN,
  GOT_GI_FILE_URL,
  GET_BOM_BY_VARIANT_ID,
  GET_SOP_BY_VARIANT_ID,
  GET_VARIANT_IMAGE_BY_ID,
  GET_ALL_USER,
  GET_ALL_USER_LOCATION_LIST,
  DELETE_USER_SUCCESSFULLY,
  SAVE_LOCATION_SUCCESSFULLY,
  SAVE_COMPONENT_SUCCESSFULLY,
  SAVE_VARIANT_SUCCESSFULLY,
  SAVE_OPERATION_SUCCESSFULLY,
  OPERATION_DELETE_SUCCESSFULLY,
  DELETE_COMPONENT_SUCCESSFULLY,
  DELETE_LOCATION_SUCCESSFULLY,
  DELETE_VARIANT_SUCCESSFULLY,
  GOT_SOP_FILE_URL,
  PAGE_LOADING,
  UPLOAD_VARIANT_SUCCESS,
} from "./../constants/actionTypes";

//get all components
export const getAllComponets =
  (pageNumber, pageSize, searchParam) => (dispatch) => {
    if (searchParam === null || searchParam === "") {
      searchParam = undefined;
    }
    axios
      .get(`/getComponents/${pageNumber}/${pageSize}/${searchParam}`)
      .then((res) =>
        dispatch({
          type: GET_ALL_COMPONENTS,
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

//add component
export const addComponents = (componentData) => (dispatch) => {
  axios
    .post(`/saveComponentDetails`, componentData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: SAVE_COMPONENT_SUCCESSFULLY,
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
//add component
export const deleteComponents = (componentData) => (dispatch) => {
  axios
    .post(`/saveComponentDetails`, componentData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: DELETE_COMPONENT_SUCCESSFULLY,
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

//get all variants
export const getAllVariants =
  (pageNumber, pageSize, searchParam) => (dispatch) => {
    if (searchParam === null || searchParam === "") {
      searchParam = undefined;
    }
    axios
      .get(`/getVariants/${pageNumber}/${pageSize}/${searchParam}`)
      .then((res) =>
        dispatch({
          type: GET_ALL_VARIANTS,
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
//get all sop
export const getAllSOP = () => (dispatch) => {
  axios
    .get(`/getAllProcessesList`)
    .then((res) =>
      dispatch({
        type: GET_ALL_SOP,
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

//add variant
export const addVarinats = (componentData) => (dispatch) => {
  dispatch(setPageLoading());
  axios
    .post(`/saveVariantDetails`, componentData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: SAVE_VARIANT_SUCCESSFULLY,
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

//get all opreation
export const getAllOperations =
  (pageNumber, pageSize, searchParam) => (dispatch) => {
    if (searchParam === null || searchParam === "") {
      searchParam = undefined;
    }
    axios
      .get(`/getAllProcesses/${pageNumber}/${pageSize}/${searchParam}`)

      .then((res) =>
        dispatch({
          type: GET_ALL_OPERATIONS,
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

//get all components List
export const getAllComponents = () => (dispatch) => {
  axios
    .get(`/getAllComponents`)
    .then((res) =>
      dispatch({
        type: GET_ALL_COMPONENTS_FOR_DROPDOWN,
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
//get image Url by component ID
export const getImageUrlByComponent = (componentId) => (dispatch) => {
  axios
    .get(`/getComponentImageById/${componentId}`)
    .then((res) => {
      dispatch({
        type: GET_COMPONENT_IMAGE_BY_ID,
        payload: res.data.data,
      });
    })

    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//get image Url by Variant ID
export const getImageUrlByVariant = (variantId) => (dispatch) => {
  axios
    .get(`/getVariantImageById/${variantId}`)
    .then((res) => {
      dispatch({
        type: GET_VARIANT_IMAGE_BY_ID,
        payload: res.data.data,
      });
    })

    .catch((error) =>
      dispatch({
        type: GET_ERROR,
        payload: error,
      })
    );
};

//delete location
export const deleteLocation = (deleteData) => (dispatch) => {
  axios
    .post(`/deleteLocation`, deleteData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: DELETE_LOCATION_SUCCESSFULLY,
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

//add Location
export const addLocation = (locationData) => (dispatch) => {
  axios
    .post(`/saveLocationDetails`, locationData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: SAVE_LOCATION_SUCCESSFULLY,
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
//add operation
export const addProcess = (operationData) => (dispatch) => {
  axios
    .post(`/saveProcessDetails`, operationData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: SAVE_OPERATION_SUCCESSFULLY,
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

//delete operation

export const deleteOperation = (deleteData) => (dispatch) => {
  axios

    .post(`/deleteProcessDetails`, deleteData)

    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: OPERATION_DELETE_SUCCESSFULLY,
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

//getAllLocations

export const getAllLocations =
  (pageNumber, pageSize, searchParam) => (dispatch) => {
    if (searchParam === null || searchParam === "") {
      searchParam = undefined;
    }

    axios

      .get(`/getAllLocations/${pageNumber}/${pageSize}/${searchParam}`)

      .then((res) =>
        dispatch({
          type: GET_ALL_LOCATIONS,
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

//get General Instruction File
export const getGIFile = (processId) => (dispatch) => {
  let data = {
    processId: processId,
  };
  axios
    .post(`/getGEInstructions`, data)
    .then((res) =>
      dispatch({
        type: GOT_GI_FILE_URL,
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

//upload variant file
export const uploadVariantFile = (variantFile) => (dispatch) => {
  axios
    .post(`/uploadVarCompMaster`, variantFile)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: UPLOAD_VARIANT_SUCCESS,
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

//get SOP file URL by variant ID
export const getSOPFileURL = (varinatId) => (dispatch) => {
  axios
    .get(`/getSOPFileByVariantId/${varinatId}`)
    .then((res) =>
      dispatch({
        type: GOT_SOP_FILE_URL,
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

//get SOP by variant ID
export const getSOPByvariantId = (variantId) => (dispatch) => {
  axios
    .post(`/getSOPInstructionsByVariantId`, { variantId: variantId })
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: GET_SOP_BY_VARIANT_ID,
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

//Method to reset the SOP List to null in reducer
export const resetSOPByvariantId = () => (dispatch) => {
  dispatch({
    type: GET_SOP_BY_VARIANT_ID,
    payload: [],
  });
};

//Method to reset the BOM List to null in reducer
export const resetBOMByvariantId = () => (dispatch) => {
  dispatch({
    type: GET_BOM_BY_VARIANT_ID,
    payload: [],
  });
};

//get BOM by variant ID
export const getBOMByvariantId = (variantId) => (dispatch) => {
  axios
    .get(`/getBOMByVariant/${variantId}`)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: GET_BOM_BY_VARIANT_ID,
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

//Delete variant by Id
export const deleteVariant = (variantData) => (dispatch) => {
  axios
    .post(`/deleteVariant`, variantData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: DELETE_VARIANT_SUCCESSFULLY,
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

//get all user
export const getAllUsers =
  (pageNumber, pageSize, searchParam) => (dispatch) => {
    if (searchParam === null || searchParam === "") {
      searchParam = undefined;
    }
    axios
      .get(
        `/getAllUserListByPagination/${pageNumber}/${pageSize}/${searchParam}`
      )
      .then((res) =>
        dispatch({
          type: GET_ALL_USER,
          payload: res.data.data,
        })
      )
      .catch((error) =>
        dispatch({
          type: GET_ERROR,
          payload: null,
        })
      );
  };

//getAllLocationList

export const getAllUserLocationList = () => (dispatch) => {
  axios
    .get(`/getLocationList`)
    .then((res) =>
      dispatch({
        type: GET_ALL_USER_LOCATION_LIST,
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

//add user data
export const addUserData = (userData) => (dispatch) => {
  axios
    .post(`/saveUserDetails`, userData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: SAVE_SUCCESSFULLY,
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
//delete user data
export const deleteUserData = (userData) => (dispatch) => {
  axios
    .post(`/saveUserDetails`, userData)
    .then((res) => {
      if (res.data.status === "success") {
        dispatch({
          type: DELETE_USER_SUCCESSFULLY,
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

//page loading
export const setPageLoading = () => {
  return {
    type: PAGE_LOADING,
  };
};
