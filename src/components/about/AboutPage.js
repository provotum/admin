import React from 'react';

class AboutPage extends React.Component {
  // is just a class because of hot-reloading -- if you want you can make it a stateless component, but to use hot reloading, the parent needs to be a class
  render() {
    return (
      <div>
        <h1>About</h1>
        <p>Something</p>
      </div>
    );
  }
}

export default AboutPage;
