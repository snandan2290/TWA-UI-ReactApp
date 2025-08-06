import { combineReducers } from "redux";
import LoginReducer from './loginReducer';
import ManageWorkOrderReducer from './manageWorkOrderReducer';
import MasterDataReducer from './masterDataReducers';
import VariantReducer from './variantRaducer';
import SubVariantReducer from './subVariantReducer';
import OperationReducer from './operationReducer';
import LocationReducer from "./locationReducer";
import UserManagementReducer from './userManagementReducer';
import FeedbackReducer from './feedbackReducer';

const rootReducer = combineReducers({
  auth: LoginReducer,
  WorkOrder: ManageWorkOrderReducer,
  MasterData : MasterDataReducer,
  VariantData:VariantReducer,
  SubVariantData: SubVariantReducer,
  OperationData:OperationReducer,
  LocationData:LocationReducer,
  UserData:UserManagementReducer,
  FeedbackData:FeedbackReducer
});

export default rootReducer;
