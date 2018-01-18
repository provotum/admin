import * as types from '../actions/actionTypes';

export default function courseReducer(state = [], action) {
  switch (action.type) {
    case types.CREATE_COURSE:
      //debugger;
      return [...state, // "..." ES6 spread operator -- spreads the array
        Object.assign({}, action.course)];
    default:
      return state;
  }
}
