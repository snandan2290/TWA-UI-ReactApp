import {
  GET_ERROR,
  GET_ALL_LOCATIONS,
  SAVE_LOCATION_SUCCESSFULLY,
  DELETE_LOCATION_SUCCESSFULLY
} from "../constants/actionTypes";

const initialState = {
  locationsCount: 0,
  allLocations: [],
  saveLocationSuccessFully: false,
  deleteLocationSuccessFully: false,
  errorInProcessing: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_LOCATIONS:
      return {
        allLocations: action.payload.rows,
        locationsCount: action.payload.count
      };

    case SAVE_LOCATION_SUCCESSFULLY:
      return {
        ...state,
        saveLocationSuccessFully: true
      };
    case DELETE_LOCATION_SUCCESSFULLY:
      return {
        ...state,
        deleteLocationSuccessFully: true
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
