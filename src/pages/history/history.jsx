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
                _embed:'transactionDetails'
            }
        })
        .then((res)=>{
            console.log(res.data.length)
            // console.log(res.data[0].userId)
            console.log(res.data)
            this.setState({history:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderHistory=()=>{
        console.log('masuk render')
        return this.state.history.map((val)=>{
            return (
                <TableRow key={val.id}>
                    <TableCell>{val.id}</TableCell>
                    <TableCell>Hargaaa</TableCell>
                    <TableCell>{val.metode}</TableCell>
                    <TableCell>{val.status}</TableCell>
                </TableRow>
            )
        })
    }

    render() { 
        return ( 
            <div>
                <Header/>
                <div className='pt-3' style={{paddingLeft:'5%', paddingRight:'5%'}}>
                    <Paper >
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID. Pembelian</TableCell>
                                        <TableCell>Total Harga</TableCell>
                                        <TableCell>Metode Pembayaran</TableCell>
                                        <TableCell>Status</TableCell>
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
 
export default connect(MapstatetoProps, {}) (History);