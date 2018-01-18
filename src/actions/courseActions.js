import * as types from './actionTypes';

export function createCourse(course){
  //debugger;
  return {type: types.CREATE_COURSE, course};
}
