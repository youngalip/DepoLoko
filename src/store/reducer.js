// third party
import { combineReducers } from 'redux';
import customizationReducer from './customizationReducer';
import authReducer from './authSlice';

const reducer = combineReducers({
  customization: customizationReducer,
  auth: authReducer
});

export default reducer;
