import {
  GET_ALL_COMPONENTS,
  GET_ERROR,
  GET_COMPONENT_IMAGE_BY_ID,
  GET_VARIANT_IMAGE_BY_ID,
  SAVE_COMPONENT_SUCCESSFULLY,
  DELETE_COMPONENT_SUCCESSFULLY,
} from "../constants/actionTypes";

const initialState = {
  count: 0,
  allComponents: [],
  saveComponentSuccessFully: false,
  deleteComponentSuccessFully: false,
  errorInProcessing: "",
  carouselModelImages: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_COMPONENTS:
      return {
        allComponents: action.payload.rows,
        count: action.payload.count,
      };
    case SAVE_COMPONENT_SUCCESSFULLY:
      return {
        ...state,
        saveComponentSuccessFully: true,
      };
    case DELETE_COMPONENT_SUCCESSFULLY:
      return {
        ...state,
        deleteComponentSuccessFully: true,
      };

    case GET_ERROR:
      return {
        ...state,
        errorInProcessing: action.payload,
      };
    case GET_COMPONENT_IMAGE_BY_ID:
      return {
        ...state,
        carouselModelImages: action.payload,
      };
    case GET_VARIANT_IMAGE_BY_ID:
      return {
        ...state,
        carouselModelImages: action.payload,
      };

    default:
      return state;
  }
}