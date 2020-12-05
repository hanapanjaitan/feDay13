import React, { Component } from 'react';
import Header from '../../component/Header';
import { connect } from 'react-redux';
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
import {AddHistoryAction} from './../../redux/Actions'
import {MdDeleteForever} from 'react-icons/md'
import {BiEditAlt} from 'react-icons/bi'

class History extends Component {
    state = { 
        history: [],
        isOpen: false,
        indexDetails: 0
    }

    componentDidMount(){
        // http://localhost:4000/transactions/2/transactionDetails
        // http://localhost:4000/transactionDetails?transactionId=2&_expand=transaction
        // Axios.get(`${API_URL}/transactions?userId=${this.props.id}&_expand=transactionDetail`)

        // http://localhost:4000/transactions?userId=1&_embed=transactionDetails
        // Axios.get(`${API_URL}/transactions?userId=${this.props.id}&_embed=transactionDetails`)
        Axios.get(`${API_URL}/transactions`,{
            params:{
                userId: this.props.id,
                status: "Completed",
                _embed:'transactionDetails'
            }
        })
        .then((res)=>{
            console.log(res.data.length)
            // console.log(res.data[0].userId)
            console.log(res.data[0].transactionDetails[0].namatrip)
            this.setState({history:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    dateformat=(n)=>{
        var today = new Date(n);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
    
        today = dd + '-' + mm + '-' + yyyy;
        return today
    }

    onDetailsClick=(index)=>{
        this.setState({indexDetails: index})
        this.setState({isOpen: true})
    }
    
    renderDetailsHistory=()=>{
        return this.state.history[this.state.indexDetails].transactionDetails.map((val,index)=>{
            return (
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.namatrip}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'200px'}}>
                            <img width='100%' heigth='100%' src={val.gambar} alt={val.namatrip}/>
                        </div>
                    </TableCell>
                    <TableCell>{val.qty}</TableCell>
                    <TableCell>{priceFormatter(val.price)}</TableCell>
                    <TableCell>{priceFormatter(val.price * val.qty)}</TableCell>
                </TableRow>
            )
            
        })
        // return this.state.history.map((val1)=>{
        // })
    }

    renderTotalHarga=()=>{
        var total= this.state.history.reduce((total, val)=>{
            
            var detail = val.transactionDetails.reduce((total, num)=>{
                return total + (num.price * num.qty)
            },0)
            return detail
        },0)

        return total
    }

    renderHistory=()=>{
        console.log('masuk render')
        return this.state.history.map((val, index)=>{
            return (
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.metode}</TableCell>
                    <TableCell>{this.dateformat(val.tanggalPembayaran)}</TableCell>
                    <TableCell>{val.status}</TableCell>
                    <TableCell>
                        <ButtonUi onClick={()=>this.onDetailsClick(index)}>Details</ButtonUi>
                    </TableCell>
                </TableRow>
            )
        })
    }

    render() { 
        return ( 
            <div>
                {
                    this.state.history.length ?
                    <Modal size='lg' isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen: false})}>
                        <ModalHeader isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen: false})}>Details</ModalHeader>
                        <ModalBody isOpen={this.state.isOpen} toggle={()=>this.setState({isOpen: false})}>
                            <Paper >
                                <TableContainer >
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Nama Product</TableCell>
                                                <TableCell>Gambar</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>Harga</TableCell>
                                                <TableCell>Sub Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.renderDetailsHistory()}
                                        </TableBody>
                                        <TableFooter>
                                            <TableCell colSpan={4}></TableCell>
                                            <TableCell style={{fontWeight:'700', color:'black', fontSize:20}}>Subtotal Harga</TableCell>
                                            <TableCell style={{fontWeight:'700', color:'black', fontSize:20}}>{priceFormatter(this.renderTotalHarga())}</TableCell>
                                        </TableFooter>
                                    </Table>
                                    <TableCell>
                                        <ButtonUi onClick={()=>this.setState({isOpen: false})}>OK</ButtonUi>
                                    </TableCell>
                                </TableContainer>
                            </Paper>
                        </ModalBody>
                    </Modal>
                    : null
                }
                <Header/>
                <div className='d-flex justify-content-center align-items-center mt-3'>
                    <h1>History pembelanjaan { this.props.username}</h1>
                </div>
                <div className='pt-3' style={{paddingLeft:'5%', paddingRight:'5%'}}>
                    <Paper >
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>No.</TableCell>
                                        <TableCell>Metode Pembayaran</TableCell>
                                        <TableCell>Tanggal Pembayaran</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Details</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.renderHistory()}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
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
 
export default connect(MapstatetoProps) (History);