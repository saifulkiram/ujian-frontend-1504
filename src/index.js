import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import semuareducer from './reducer/index'

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App'

let globalState = createStore(semuareducer)
globalState.subscribe(()=>console.log("Global State:", globalState.getState()))

ReactDOM.render(
  <Provider store={globalState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)


