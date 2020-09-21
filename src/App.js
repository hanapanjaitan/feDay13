import React, { useEffect, useState } from 'react';
import History from './pages/history/history'
import Header from './component/Header'
import './App.css';
import {
  Home,
  Admin
} from './pages'
// import Home from './pages/home/home'
import {Loading} from './component'
import ManageAdmin from './pages/admin/admin'
import {Switch, Route} from 'react-router-dom'
import Login from './pages/Login/Login'
import ProfileAdmin from './pages/admin/profileAdmin'
import {connect} from 'react-redux'
import {LoginFunc} from './redux/Actions'
import Axios from 'axios'
import { API_URL } from './helpers/idrformat';
import Notfound from './pages/notfound'
import Listprod from './pages/Listprod' //kalau ga nunjuk nama file, auto nunjuk index.jsx
import DetailProd from './pages/detailprod'
import Cart from './pages/cart'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Register from './pages/register/register'
toast.configure()

//umum: register, logout
//user: history, filter
//admin: confirm admin

function App(props) {
  const [loading, setLoading] = useState(true)
  useEffect (()=>{
    var id = localStorage.getItem('id')
    if (id){
      Axios.get(`${API_URL}/users/${id}`)
      .then((res)=>{
        Axios.get(`${API_URL}/carts`,{
          params:{
            userId: res.data.id,
            _expand:'product'
          }
        }).then((res1)=>{
          props.LoginFunc(res.data, res1.data)
          // Axios.get(`${API_URL}/transactions`,{
          //   params:{
          //       userId: res.data.id,
          //       _embed:'transactionDetails'
          //   }
          // }).then((res2)=>{
          //   props.LoginFunc(res.data, res1.data, res2.data)
          // }).catch((err)=>{
          //   console.log(err)
          // })
        }).catch((err)=>{
          console.log(err)
        }).finally(()=>{
          setLoading(false)
        })
      }).catch((err)=>{
        console.log(err)
      })
    }else{
      setLoading(false)
    }
  },[])
  if(loading){
    return (
      <div><Loading/></div>
    )
  }

  const renderProtectedRoutes=()=>{
    if(props.role === 'admin')
    return (
      <>
        <Route exact path='/manageAdmin' component={Admin}/>
      </>
    )
  }

  return (
    <div>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route exact path='/login' component={Login}/>
        <Route exact path='/register' component={Register}/>
        <Route exact path='/products' component={Listprod}/>
        <Route exact path='/profileAdmin' component={ProfileAdmin}/>
        <Route exact path='/profile' component={History}/>
        {/* gapake exact karna ada /:id */}
        <Route path='/products/:id' component={DetailProd}/> 
        <Route path='/carts' component={Cart}/>
        {renderProtectedRoutes()}
        <Route path='*' component={Notfound}/>
      </Switch>
    </div>
  );
}

const MapstatetoProps=({Auth})=>{
  return {
    ...Auth, role: Auth.role
  }
}

export default connect(MapstatetoProps,{LoginFunc}) (App);
