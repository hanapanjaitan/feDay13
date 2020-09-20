import React, {Component, createRef} from 'react';
import './Login.css'
import Foto from './../../assets/Homescreen.webp'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Axios from 'axios'
import {API_URL} from './../../helpers/idrformat'
import { Alert } from 'reactstrap';
import {connect} from 'react-redux';
import {Redirect, Link} from 'react-router-dom'
import {LoginFunc, LoginThunk, Clearfunc} from './../../redux/Actions/'

const Styles={
    root:{
        '& label.Mui-focused': {
            color: 'white',
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'yellow',
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
              border:'3px solid '
            },
          },
    }

}

class Login extends Component{
    state = {
        username: createRef(),
        password: createRef(),
        alert: ''
    }

    onLoginClick=()=>{
        const {username, password} = this.state
        var usernameInp = username.current.value
        var passwordInp = password.current.value
        this.props.LoginThunk(usernameInp, passwordInp)
        // console.log(usernameInp, passwordInp)
        // Axios.get(`${API_URL}/users?username=${usernameInp}&password=${passwordInp}`)
        // .then((res)=>{
        //     console.log('masuk then onLoginClick')
        //     console.log(res.data)
        //     if(res.data.length){
        //         localStorage.setItem('id',res.data[0].id)
        //         this.props.LoginFunc(res.data[0])
        //     }else{
        //         console.log('user salah password')
        //         this.setState({alert:'Password / Username salah'})

        //     }
        // }).catch((err)=>{
        //     console.log(err)
        // })
    }

    render (){
        const {classes} = this.props;
        console.log(this.props.Auth)
        if(this.props.Auth.isLogin){
            return <Redirect to='/'/>
        }
        return(
            <div className='row m-0 p-0'>
                <div className='col md-6 m-0 p-0' style={{height:'100vh'}}>
                    <img width='100%' height='100%' style={{objectFit:'cover', objectPosition:'center'}} src={Foto} alt="foto"/>
                </div>
                <div className='col md-6 d-flex justify-content-center align-items-center' style={{backgroundColor:'lightpink'}}>
                    <div className='login-kotak d-flex px-4' style={{width:'60%', height:'55%'}}>
                        <h1 className='align-self-center'>Login</h1>
                        <div className='mt-2'>
                            <TextField className={classes.root} inputRef={this.state.username} id="outlined-basic" fullWidth='true' label="Username" variant="outlined" size='small' />
                        </div>
                        <div className='mt-2'>
                            <TextField className={classes.root} inputRef={this.state.password} id="outlined-basic" fullWidth='true' type='password' label="Password" variant="outlined" size='small' />
                        </div>
                        {/* <Alert severity="error">This is an error alert — check it out!</Alert> */}
                        <div className="mt-3 mb-2">
                            {
                                this.props.Auth.error ?
                                <Alert color="danger" className='py-2'>
                                    { this.props.Auth.error } <span className='float-right' onClick={()=>this.props.Clearfunc()}>x</span>
                                </Alert>
                                :
                                null
                            }
                        </div>
                        <div className='align-self-end'>
                            <button disabled={this.props.Auth.isLoading} onClick={this.onLoginClick} className='py-2 px-3 rounded' style={{border:'white 1px solid', backgroundColor:'transparent'}}>
                                Login
                            </button>
                        </div>
                        <div className='text-dark'>
                            Belum punya akun?
                            <Link to='/register'>
                            <span> Register</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const Mapstatetoprops=(state)=>{
    return {
        Auth: state.Auth
    }
}

export default withStyles(Styles) (connect(Mapstatetoprops,{LoginFunc, LoginThunk, Clearfunc}) (Login))