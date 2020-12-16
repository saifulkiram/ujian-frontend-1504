import React from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'
import { Route, Switch} from 'react-router-dom'

import Navigation from './component/nav'

import Home from './page/home'
import Login from './page/login'
import Product from './page/productpage'
import Cart from './page/cart'
import PurcHistory from './page/ShopingHistory'

import {login} from './action/ActionUser'
import {getHistory} from './action/HAction'

class App extends React.Component {

  componentDidMount(){
    Axios.get(`http://localhost:2000/users/${localStorage.email}`)
    .then ((resp)=>{
      console.log(resp.data);
      this.props.login(resp.data)

      Axios.get(`http://localhost:2000/history?email=${this.props.email}`)
      .then((resp)=>{
        console.log(resp.data)
        this.props.getHistory(resp.data)
      })
      .catch((err)=>console.log(err))
    })
  }

  render (){
    return(
      <div>
        <Navigation/>
        <Switch>
          <Route path='/' component={Home} exact/>
          <Route path='/login' component={Login}/>
          <Route path='/product' component={Product}/>
          <Route path='/cart' component={Cart}/>
          <Route path='/PurchaseHistory' component={PurcHistory}/>
        </Switch>
      </div>
    )
  }
}

const mapStateToProps =(state) =>{
  return {
    email : state.user.email,
  }
}

export default connect(mapStateToProps, {login, getHistory})(App)
