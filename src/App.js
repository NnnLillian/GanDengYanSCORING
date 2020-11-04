import React from 'react';
import 'antd/dist/antd.css';
import Home from './pages/home/home';
import Settings from './pages/settings/setting';

import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store';
import { MyMenu } from './component/menu';
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <MyMenu />
        <Route path='/' exact component={Home}></Route>
        <Route path='/settings' exact component={Settings}></Route>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
