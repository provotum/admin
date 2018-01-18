import {combineReducers} from 'redux';
import courses from './courseReducers';

// naming the courseReducer here implies what you need to call throughout the application.
// therefore, it's important to name this nicely.
// ES6 SHORT HAND PROPERTY NAMES is wht courses below is
const rootReducer = combineReducers({
  courses
});

export default rootReducer;
