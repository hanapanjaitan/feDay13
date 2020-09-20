import React, {Component} from 'react';
import Homescreen from './../../assets/Homescreen.webp'
import Travelbag from './../../assets/travelbag.svg'
import Mappict from './../../assets/map.svg'
import Header from '../../component/Header'
import './../home/home.css'
import ButtonUI from './../../component/button'
import { Link } from 'react-router-dom'

class Home extends Component{
    state= {}
    render(){
        return(
            <div>
                <Header/>
                <div style={{width:'100%', height:'90vh'}}>
                    <img src={Homescreen} style={{objectFit:'cover'}} width='100%' height='100%'/>
                </div>
                <div className='d-flex align-items-center px-3' style={{height:'8vh', backgroundColor:'lightgray', justifyContent:'space-between'}}>
                    <div>
                        Promo menarik!!!
                    </div>
                    <div>
                        <Link to='/products'>
                            <ButtonUI className='my-3'>
                                Cek Promo
                            </ButtonUI>
                        </Link>
                    </div>
                </div>
                <div className='row p-0 mt-4 mx-0'>
                    <div className="col-md-6 pl-5 m-0">
                        <h2>A thousand kisses and hugs, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis libero eaque fugiat,</h2>
                    </div>
                    <div className="col-md-6 pr-5 m-0">
                        <img src={Travelbag} width='100%' height='80%'/>
                    </div>
                </div>
                <div className='row p-0 mt-4 mx-0'>
                    <div className="col-md-6 pl-5 m-0">
                        <img src={Mappict} width='100%' height='80%'/>
                    </div>
                    <div className="col-md-6 pr-5 m-0">
                    <h2>A thousand kisses and hugs, Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis libero eaque fugiat,</h2>
                    </div>
                </div>
                <div className='text-white d-flex justify-content-center align-items-center' style={{height:'20vh', backgroundColor:'#fe6b8b'}}>
                    <h1>Join now</h1>
                </div>
            </div>
        )
    }
}

export default Home