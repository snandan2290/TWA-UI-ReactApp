import {
  GET_ERROR,
  GET_ALL_VARIANTS,
  SAVE_VARIANT_SUCCESSFULLY,
  DELETE_VARIANT_SUCCESSFULLY,
  GOT_SOP_FILE_URL,
  PAGE_LOADING,
  UPLOAD_VARIANT_SUCCESS
} from "../constants/actionTypes";

const initialState = {
  variantsCount: 0,
  allVariants: [],
  saveVariantSuccessFully: false,
  deleteVariantSuccessFully: false,
  errorInProcessing: "",
  fileUrlSOP: "",
  loading:false,
  uploadVariantSuccess: ""
};

export default function(state = initialState, action) {
  switch (action.type) {

    case PAGE_LOADING:
    return {
        ...state,
        loading:true
    }

    case GET_ALL_VARIANTS:
      return {
        allVariants: action.payload.rows,
        variantscount: action.payload.count
      };

    case SAVE_VARIANT_SUCCESSFULLY:
      return {
        ...state,
        fileUrlSOP: "",
        saveVariantSuccessFully: true,
        loading:false
      };
    case GOT_SOP_FILE_URL:
      return {
        ...state,
        fileUrlSOP: action.payload
      };
      case UPLOAD_VARIANT_SUCCESS:{
        console.log("UPLOAD_VARIANT_SUCCESS", action.payload);
        console.log("UPLOAD_VARIANT_SUCCESS state",state);
        return {
          ...state,
          uploadVariantSuccess: action.payload
        };
      }
    case DELETE_VARIANT_SUCCESSFULLY:
      return {
        ...state,
        deleteVariantSuccessFully: true
      };

    case GET_ERROR:
      return {
        ...state,
        errorInProcessing: action.payload,
        loading:false
      };

    default:
      return state;
  }
}
