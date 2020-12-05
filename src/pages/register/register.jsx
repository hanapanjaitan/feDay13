import React, { Component, createRef } from 'react';
import './register.css'
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { Link, Redirect } from 'react-router-dom';
import Axios from 'axios'
import { API_URL, API_URL_SQL } from '../../helpers/idrformat';
import {connect} from 'react-redux'
import {LoginFunc} from './../../redux/Actions'


class Register extends Component {
    state = { 
        // username : createRef(),
        // password : createRef(),
        // repassword : createRef(),
        username :'',
        password :'',
        repassword :'',
        emai:'',
        error:'',
        errorPass: '',
        isLoading: false,
        toHome: false
    }

    cekPass=(input)=>{
        var password = input.split('')
        var num = [1,2,3,4,5,6,7,8,9,0]
        var lowerCase = ('abcdefghijklmnopqrstuvwxyz').split('')
        var upperCase = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ').split('')
        var strengthNum = 0
        var strengthLow = 0
        var strengthUp = 0
        var trueLength = password.length
    
        for(var i=0; i<password.length; i++){
            for(var j=0; j<num.length; j++){
                if(password[i] == num[j]){
                    strengthNum ++
                }
            }
            for(var k=0;k<lowerCase.length; k++){
                if(password[i] == lowerCase[k]){
                    strengthLow ++
                }
            }
            for(var m=0;m<upperCase.length; m++){
                if(password[i] == upperCase[m]){
                    strengthUp ++
                }
            }
            if(password[i] == ' '){
                trueLength --
            }
        }
        // if(strengthNum>0 && strengthUp>0 && strengthLow>0){
        //     return 'Pass berhasil'
        // }
        if(trueLength < 6){
            this.setState({errorPass:'Character kurang dari 6'})
            return false
        }
        if(strengthLow == 0 && strengthUp == 0){
            this.setState({errorPass:'harus ada huruf'})
            return false
        }
        if(strengthNum == 0){
            this.setState({errorPass:'harus ada angka'})
            return false
        }
    
        return true
    }

    onRegisterClick=()=>{
        const {username, password, repassword, email} = this.state
        const role = "user"
        var newUser = {username, password, role, email}
        // var usernameReg = username.current.value
        // var passwordReg = password.current.value
        // var repasswordReg = repassword.current.value
        // console.log(usernameReg, passwordReg, repasswordReg)
        if(username === '' || password === '' || repassword === '' || email === ''){
            alert('gaboleh kosong datanya')
        }else{
            Axios.get(`${API_URL}/users?username=${username}`)
            .then((res)=>{
                console.log(res.data.length)
                if(res.data.length === 0){
                    if(password !== repassword){
                        alert('password tidak sama')
                    }else{
                        if(this.cekPass(password)){
                            Axios.post(`${API_URL_SQL}/auth/register`, {
                                username,
                                password,
                                email
                            })
                            .then((res)=>{
                                alert('Sukses! berhasil register')
                                localStorage.setItem('id', res.data.id)
                                this.props.LoginFunc(res.data, [])
                            }).catch((err)=>{
                                alert(err.response.data.message) // ambil message yg udh dibikin di backend
                            })
                            // Axios.post(`${API_URL}/users`, newUser)
                            // .then((res1)=>{
                            //     alert('Sukses! berhasil register')
                            // }).catch((err)=>{
                            //     console.log(err)
                            // })
                        }else{
                            alert(this.state.errorPass)
                        }
                    }
                }else{
                    alert('username sudah ada, yg lain anjim')
                }
            }).catch((err)=>{
                console.log(err)
            })
        }

        console.log(username)
        console.log(password)
        console.log(repassword)
        console.log(role)
    }

    onChangeInput=(e, property)=>{
        this.setState({[property]:e.target.value})
    }

    render() { 
        // if(this.props.isLogin){
        //     window.location
        // }
        return ( 
            <div>
                <div className="mt-5 d-flex justify-content-center">
                    <div style={{ width: '500px',  border: '2px inset blue'}} className='rounded p-4'>
                        <h1><center>Register</center></h1>

                        <h3><FaUserCircle/></h3>
                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='text' onChange={(e)=>this.onChangeInput(e,'username')} className='username' style={{ border: 'transparent', width: '100%', fontsize: '20px' }}  placeholder='Username' />
                        </div>

                        <div className='mt-3'></div>

                        <h3><FaLock/></h3>
                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='password' onChange={(e)=>this.onChangeInput(e,'password')} className='username' style={{ border: 'transparent', width: '100%', fontsize: '20px' }} placeholder='Password' />
                        </div>

                        <div className='mt-4'></div>

                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='password' onChange={(e)=>this.onChangeInput(e,'repassword')} className='username' style={{ border: 'transparent', width: '100%', fontsize: '20px' }}  placeholder='Re-enter Password' />
                        </div>

                        <div className='mt-4'></div>

                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='email' onChange={(e)=>this.onChangeInput(e,'email')} style={{ border: 'transparent', width: '100%', fontsize: '20px' }}  placeholder='Email' />
                        </div>
 
                        <div className='mt-4'>
                                <button className='btn btn-primary' onClick={this.onRegisterClick}>Register</button>
                        </div>

                        <div className='mt-4'>
                            sudah punya akun? <Link to='/login'>Login</Link>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 

const MapstatetoProps=({Auth})=>{
    return {
      ...Auth
    }
  }
  
export default connect(MapstatetoProps,{LoginFunc}) (Register);
  