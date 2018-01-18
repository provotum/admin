import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as courseActions from '../../actions/courseActions';

class CoursesPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      course: {title: ""}
    };

    // this binds the function to the correct instance
    // using bind in redner is a performance issue, don't define in render
    // therefore it's best to place it here in the constructor
    this.onClickSave = this.onClickSave.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);

  }

  onTitleChange(event) {
    const course = this.state.course;
    course.title = event.target.value;
    this.setState({course: course});
  }

  onClickSave(){
    this.props.actions.createCourse(this.state.course);
  }

  courseRow(course, index){
    return <div key={index}>{course.title}</div>;
  }

  render() {
    //debugger;
    return (
      <div>
        <h1>Courses</h1>
        {this.props.courses.map(this.courseRow)}
        <input
          type="text"
          onChange={this.onTitleChange}
          value={this.state.course.title}/>
        <input
          type="submit"
          value="save"
          onClick={this.onClickSave}/>
      </div>
    );
  }
}

CoursesPage.propTypes = {
  //dispatch: PropTypes.func.isRequired,
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

// two ()() near each other just means two function calls right after one another
// passing the result from the first function to the next function
// it's quite normal in functional programming
// alternative is a two liner as follows:

// const connectedStateAndProps = connect(mapStateToProps, mapDispatchToProps);
// export default connectedStateAndProps(CoursesPage);

function mapStateToProps(state, ownProps){
  //debugger;
  return {
    courses: state.courses // this accesses the store data through the reducer
  };
}

// dispatch is injected by the connect function
function mapDispatchToProps(dispatch){
  return {
    // We need to wrap the call to createCourse in a dispatch call in order to start the Redux Flow
    // variante 1: createCourse: course => dispatch(courseActions.createCourse(course))
    // variante 2: unten
    actions: bindActionCreators(courseActions, dispatch)
  };

}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
