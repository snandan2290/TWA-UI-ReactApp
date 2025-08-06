import {
  GET_ALL_SOP,
  GET_ALL_COMPONENTS_FOR_DROPDOWN,
  GET_SOP_BY_VARIANT_ID,
  GET_BOM_BY_VARIANT_ID
} from "../constants/actionTypes";

const initialState = {
  allSOP: [],
  dropDownComponentList: [],
  getSOPByvariantId: [],
  getBOMByvariantId: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_SOP:
      return {
        allSOP: action.payload
      };
    case GET_ALL_COMPONENTS_FOR_DROPDOWN:
      return {
        ...state,
        dropDownComponentList: action.payload
      };

    case GET_SOP_BY_VARIANT_ID:
      return {
        ...state,
        getSOPByvariantId: action.payload
      };

    case GET_BOM_BY_VARIANT_ID:
      return {
        ...state,
        getBOMByvariantId: action.payload
      };

    default:
      return state;
  }
}
