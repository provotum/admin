import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import './styles/styles.css'; // webpack can also import css
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// passing initial state here only when there's server rendered stuff
const store = configureStore();

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>,
  document.getElementById('app')
);
