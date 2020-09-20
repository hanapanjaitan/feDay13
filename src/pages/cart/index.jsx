import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import Header from '../../component/Header';
import Axios from 'axios'
import { API_URL, priceFormatter } from '../../helpers/idrformat';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {TableFooter} from '@material-ui/core'
import NotFound from './../notfound';
import ButtonUi from './../../component/button'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import {AddCartAction} from './../../redux/Actions'
import {MdDeleteForever} from 'react-icons/md'
import {BiEditAlt} from 'react-icons/bi'

class Cart extends Component {
    state = { 
        cart:[],
        isOpen: false,
        pilihan: 0,
        bukti: createRef(),
        cc: createRef()
     }

    componentDidMount(){
        // Axios.get(`${API_URL}/carts?userId=${this.props.id}&_expand=product`)
        Axios.get(`${API_URL}/carts`,{
            params:{
                userId: this.props.id,
                _expand:'product'
            }
        })
        .then((res)=>{
            console.log(this.props.cart)
            console.log(res.data)
            this.setState({cart:res.data})
            // alert('Berhasil masukkan ke cart')
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderTotalHarga=()=>{
        var total= this.state.cart.reduce((total, num)=>{
            return total + (num.product.harga * num.qty)
        },0)

        return total
    }

    renderCart=()=>{
        return this.state.cart.map((val,index)=>{
            return (
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.product.namatrip}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'200px'}}>
                            <img width='100%' heigth='100%' src={val.product.gambar} alt={val.product.namatrip}/>
                        </div>
                    </TableCell>
                    <TableCell>{val.qty}</TableCell>
                    <TableCell>{priceFormatter(val.product.harga)}</TableCell>
                    <TableCell>{priceFormatter(val.product.harga * val.qty)}</TableCell>
                    <TableCell>
                        <span style={{fontSize:30}} className='text-danger mr-3'><MdDeleteForever/></span>
                        <span style={{fontSize:30}} className='text-primary ml-3'><BiEditAlt/></span>
                    </TableCell>
                </TableRow>
            )
        })
    }

    // transaction ada id, status, userId, tanggalPembayaran, metode, bukti pembayaran
    // transactionDetails ada id, transactionId, productId, price, qty

    onBayarClick=()=>{
        const {pilihan} = this.state
        if(pilihan === '1'){ // via transfer
            this.onBayarPakeBukti()
        }else if (pilihan === '2'){
            this.onBayarPakeCC()
            
        }else{
            alert ('Pilih dulu metode pemabayaran')
        }
    }

    onBayarPakeCC=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status: 'Completed',
            userId: this.props.id,
            tanggalPembayaran: '',
            metode: 'cc',
            buktiPembayaran: this.state.cc.current.value
        }).then((res)=>{
            var arr = []
            this.state.cart.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionDetails`, {
                    transactionId: res.data.id,
                    productId: val.product.id,
                    price: parseInt(val.product.harga),
                    qty: val.qty
                }))
            })
            Axios.all(arr).then((res1)=>{
                var deleteArr = []
                this.state.cart.forEach((val)=>{
                    deleteArr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deleteArr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId: this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        console.log(res3.data)
                        this.props.AddCartAction([])
                        this.setState({cart:res3.data, isOpen:false})
                        
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((Err)=>{
                    console.log(Err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    onBayarPakeBukti=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status: 'WaitingAdmin',
            userId: this.props.id,
            tanggalPembayaran: '',
            metode: 'upload',
            buktiPembayaran: this.state.bukti.current.value
        }).then((res)=>{
            var arr = []
            this.state.cart.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionDetails`, {
                    transactionId: res.data.id,
                    productId: val.product.id,
                    price: parseInt(val.product.harga),
                    qty: val.qty
                }))
            })
            Axios.all(arr).then((res1)=>{
                var deleteArr = []
                this.state.cart.forEach((val)=>{
                    deleteArr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deleteArr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId: this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        console.log(res3.data)
                        this.props.AddCartAction([])
                        this.setState({cart:res3.data, isOpen:false})
                        
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((Err)=>{
                    console.log(Err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    onCheckOutClick=()=>{
        this.setState({isOpen: true})
        // Axios.post(`${API_URL}/transactions`,{
        //     status: 'WaitingPayment',
        //     checkoutDate: new Date().getTime(),
        //     userId: this.props.id,
        //     tanggalPembayaran: ''
        // }).then((res)=>{
        //     var arr = []
        //     this.state.cart.forEach((val)=>{
        //         arr.push(Axios.post(`${API_URL}/transactionDetails`, {
        //             transactionId: res.data.id,
        //             productId: val.product.id,
        //             price: parseInt(val.product.harga),
        //             qty: val.qty
        //         }))
        //     })
        //     Axios.all(arr).then((res1)=>{
        //         var deleteArr = []
        //         this.state.cart.forEach((val)=>{
        //             deleteArr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
        //         })
        //         Axios.all(deleteArr)
        //         .then(()=>{
        //             Axios.get(`${API_URL}/carts`,{
        //                 params:{
        //                     userId: this.props.id,
        //                     _expand:'product'
        //                 }
        //             })
        //             .then((res3)=>{
        //                 console.log(res3.data)
        //                 this.setState({cart:res3.data})
                        
        //             }).catch((err)=>{
        //                 console.log(err)
        //             })
        //         }).catch((Err)=>{
        //             console.log(Err)
        //         })
        //     }).catch((err)=>{
        //         console.log(err)
        //     })
        // }).catch((err)=>{
        //     console.log(err)
        // })
    }

    render() { 
        if(this.props.role === 'user'){
            return ( 
                <div>
                    <Modal isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen: false})}>
                        <ModalHeader toggle={()=>this.setState({isOpen: false})}>Pembayaran</ModalHeader>
                        <ModalBody>
                            <select onChange={(e)=>this.setState({pilihan:e.target.value})} className='form-control' defaultValue={0}>
                                <option value="0" hidden>Select payment method</option>
                                <option value="1">Via transfer</option>
                                <option value="2">Via Credit Card</option>
                            </select>
                            {
                                this.state.pilihan==2 ?
                                <input className='form-control' ref={this.state.cc} placeholder='masukkan cc'/>
                                :
                                this.state.pilihan == 1?
                                <input className='form-control' ref={this.state.bukti} placeholder='input bukti pembayaran'/>
                                :
                                null
                            }
                            <div>
                                TotalHarga {priceFormatter(this.renderTotalHarga())}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <ButtonUi onClick={this.onBayarClick}>
                                Bayar
                            </ButtonUi>
                        </ModalFooter>
                    </Modal>
                    <Header/>
                    <div className='pt-3' style={{paddingLeft:'5%', paddingRight:'5%'}}>
                        <Paper >
                            <TableContainer >
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Nama Trip</TableCell>
                                            <TableCell style={{width:'200px'}}>Gambar</TableCell>
                                            <TableCell>Jumlah</TableCell>
                                            <TableCell>Harga</TableCell>
                                            <TableCell>Subtotal Harga</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderCart()}
                                    </TableBody>
                                    <TableFooter>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell style={{fontWeight:'700', color:'black', fontSize:20}}>Subtotal Harga</TableCell>
                                        <TableCell style={{fontWeight:'700', color:'black', fontSize:20}}>{priceFormatter(this.renderTotalHarga())}</TableCell>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            <ButtonUi onClick={this.onCheckOutClick} className='my-3'>
                                Checkout
                            </ButtonUi>
                        </Paper>

                    </div>
                </div>
             );

        }else{
            return <NotFound/>
        }
    }
}

const MapstatetoProps=({Auth})=>{
    return {
      ...Auth, role: Auth.role
    }
}

export default connect(MapstatetoProps, {AddCartAction}) (Cart);