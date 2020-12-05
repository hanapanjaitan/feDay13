import React, { Component, createRef } from 'react';
import Header from '../../component/Header';
import { FaUserCircle, FaLock } from 'react-icons/fa';
import { Link, Redirect } from 'react-router-dom';
import Axios from 'axios'
import { API_URL } from '../../helpers/idrformat';
import {connect} from 'react-redux';

class Setting extends Component {
    state = { 
        password :createRef(),
        repassword : createRef(),
        error:'',
        errorPass: '',
        isLoading: false,
        toHome: false
     }

    onSaveClick=()=>{ // bug mas ini saya bingung kenapa
        const {repassword, password} = this.state
        var passwordInp = password.current.value
        var repasswordInp = repassword.current.value
        // console.log(usernameReg, passwordReg, repasswordReg)
        if(passwordInp === '' || repasswordInp === ''){
            alert('gaboleh kosong datanya')
        }else{
            // http://localhost:4000/users/1
            if(passwordInp !== repasswordInp){
                alert('password tidak sama')
            }else{
                Axios.patch(`${API_URL}/users/${this.props.id}`,{
                    password: passwordInp
                })
                .then((res)=>{
                    console.log(res.data.length)
                    alert('berhasil updet password')
                }).catch((err)=>{
                    console.log(err)
                })
            }
        }
    }

    render() { 
        return ( 
            <div>
                <Header/>
                <div className="mt-5 d-flex justify-content-center">
                    <div style={{ width: '500px',  border: '2px inset blue'}} className='rounded p-4'>
                        <h1><center>Change Password</center></h1>

                        <h3><FaUserCircle/></h3>
                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='text'  className='username' style={{ border: 'transparent', width: '100%', fontsize: '20px' }}  placeholder='Username' 
                            defaultValue={this.props.username} ref="user" disabled/>
                        </div>

                        <div className='mt-3'></div>

                        <h3><FaLock/></h3>
                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='password' ref={this.state.password} className='username' style={{ border: 'transparent', width: '100%', fontsize: '20px' }} placeholder='Password' />
                        </div>

                        <div className='mt-4'></div>

                        <div className='p-1' style={{border:'2px outset blue'}}>
                            <input type='password' ref={this.state.repassword} className='username' style={{ border: 'transparent', width: '100%', fontsize: '20px' }}  placeholder='Re-enter Password' />
                        </div>
 
                        <div className='mt-4'>
                                <button onClick={this.onSaveClick} className='btn btn-primary' >Save</button>
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

export default connect(MapstatetoProps) (Setting);