import React, { Component, createRef } from 'react';
import './register.css'
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { Link, Redirect } from 'react-router-dom';
import Axios from 'axios'
import { API_URL } from '../../helpers/idrformat';

class Register extends Component {
    state = { 
        // username : createRef(),
        // password : createRef(),
        // repassword : createRef(),
        username :'',
        password :'',
        repassword :'',
        error:'',
        isLoading: false,
        toHome: false
     }

    onRegisterClick=()=>{
        const {username, password, repassword} = this.state
        const role = "user"
        var newUser = {username, password, role}
        // var usernameReg = username.current.value
        // var passwordReg = password.current.value
        // var repasswordReg = repassword.current.value
        // console.log(usernameReg, passwordReg, repasswordReg)
        if(username === '' || password === '' || repassword === ''){
            alert('gaboleh kosong datanya')
        }else{
            Axios.get(`${API_URL}/users?username=${username}`)
            .then((res)=>{
                console.log(res.data.length)
                if(res.data.length === 0){
                    if(password !== repassword){
                        alert('password tidak sama')
                    }else{
                        Axios.post(`${API_URL}/users`, newUser)
                        .then((res1)=>{
                            alert('Sukses! berhasil register')
                        }).catch((err)=>{
                            console.log(err)
                        })
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
 
                        <div className='mt-4'>
                                <button className='btn btn-primary' onClick={this.onRegisterClick}>Register</button>
                        </div>
                        <div className='mt-2'>
                            sudah punya akun? <Link to='/login'>Login</Link>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Register;