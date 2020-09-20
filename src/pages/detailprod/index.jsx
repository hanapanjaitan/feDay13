import React, { Component, createRef } from 'react';
import Header from '../../component/Header';
import {
    Breadcrumb, BreadcrumbItem, Modal, ModalBody, ModalFooter
} from 'reactstrap'
import {Link, Redirect} from 'react-router-dom'
import Axios from 'axios'
import { API_URL, dateformat } from '../../helpers/idrformat';
import ButtonUi from './../../component/button'
import {connect} from 'react-redux'
import {AddCartAction} from './../../redux/Actions'
import {toast} from 'react-toastify'

class DetailProd extends Component {
    state = { 
        loading: true,
        products: {},
        qty: createRef(),
        isOpen:false,
        toLogin: false
    }

    componentDidMount(){
        Axios.get(`${API_URL}/products/${this.props.match.params.id}`)
        .then((res)=>{
            this.setState({products:res.data, loading:false})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onAddToCart=()=>{
        if(this.props.role === 'admin'){ //string kosong = false, jadi ini maksudnya kalau true berarti user login
            alert('woy admin ngapain beli')
        }else if(this.props.role === 'user'){
            if(this.state.qty.current.value){ // kalau inputan qty >0

                Axios.get(`${API_URL}/carts`,{
                    params: {
                        userId: this.props.id,
                        productId: this.state.products.id
                    }
                }).then((res)=>{
                    // console.log(res.data[0].qty)
                    if(res.data.length){ //kalau product udah ada sebelumnya
                        Axios.get(`${API_URL}/carts`)
                        .then((res1)=>{
                            var indexProd = res1.data.findIndex((val)=>{
                                return val.userId == this.props.id && val.productId == this.state.products.id
                            })
                            // console.log('indexnya',indexProd)
                            // console.log(res1.data[indexProd])
                            // console.log(res1.data[indexProd].productId, res1.data[indexProd].userId )
                            Axios.patch(`${API_URL}/carts/${indexProd+1}`,{
                                    qty: res1.data[indexProd].qty + parseInt(this.state.qty.current.value)
                            }).then(()=>{
                                alert('berhasil updet qty')
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }else{ //kalau product belum ada samsek
                        Axios.post(`${API_URL}/carts`, {
                            userId: this.props.id, //dari redux
                            productId: this.state.products.id, //dari state
                            qty: parseInt(this.state.qty.current.value)
                        }).then(()=>{
                            Axios.get(`${API_URL}/carts`, { // http://localhost:4000/carts?userId=1&_expand=product
                                params: {
                                    userId: this.props.id,
                                    _expand: 'product'
                                }
                            }).then((res2)=>{
                                this.props.AddCartAction(res2.data)
                                alert('berhasil masuk cart')
                            }).catch((err)=>{
                                console.log(err)
                            })
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }
                }).catch((err1)=>{
                    console.log(err1)
                })
                
            }else{
                toast.error('Error! Input kosong', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }
        }else{
            this.setState({isOpen:true})
        }
    }

    onRedirectToLogin=()=>{
        this.setState({isOpen:false, toLogin:true})
    }

    render() { 
        const {products, isOpen} = this.state
        if(this.state.loading){
            return (
                <div>Loading....</div>
            )
        }

        if(this.state.toLogin){
            return <Redirect to='/login'/>
        }
        return ( 
            <div>
                <Modal isOpen={isOpen} toggle={()=>this.setState({isOpen:false})}>
                    <ModalBody>
                        Silahkan login dahulu sebelum belanja
                    </ModalBody>
                    <ModalFooter>
                        <ButtonUi onClick={this.onRedirectToLogin}>
                            OK
                        </ButtonUi>
                    </ModalFooter>
                </Modal>
                <Header/>
                <Breadcrumb className='transparent m-0 px-2'>
                    <BreadcrumbItem > <Link className='link-class' to='/'>Home</Link> </BreadcrumbItem>
                    <BreadcrumbItem > <Link className='link-class' to='/products'>Products</Link> </BreadcrumbItem>
                    <BreadcrumbItem active> <Link className='link-class'>{this.state.products.namatrip}</Link> </BreadcrumbItem>
                </Breadcrumb>
                <div className="pt-3 px-4">
                    <div style={{width:'100%', height:300}}>
                        <img src={products.gambar} style={{objectFit:'cover', objectPosition:'center'}} width='100%' height='100%'/>
                    </div>
                    <h2 className='mt-2'>
                        {products.namatrip}
                    </h2>
                    <h5 className='mt-2'>Tanggal mulai : {dateformat(products.tanggalStart)}</h5>
                    <h5 className='mt-2'>Tanggal berakhir : {dateformat(products.tanggalEnd)}</h5>
                    <label>Jumlah tiket</label>
                    <input type="number" className='form-control' placeholder='qty' style={{width:200}} ref={this.state.qty}/>
                    <ButtonUi className='mt-2' onClick={this.onAddToCart}>
                        Add to cart
                    </ButtonUi>
                    <div className='mt-3 mb-5'>{products.deskripsi}</div>
                </div>
            </div>
         );
    }
}

const MapstatetoProps=({Auth})=>{
    return {
      ...Auth, role: Auth.role
    }
}

export default connect(MapstatetoProps,{AddCartAction}) (DetailProd);