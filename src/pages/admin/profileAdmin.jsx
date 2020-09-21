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

class ProfileAdmin extends Component {
    state = { 
        historyUser : []
    }

    componentDidMount(){
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
            this.setState({historyUser:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }
    
    render() { 
        return ( 
            <div>
                <Header/>
                <div className='d-flex justify-content-center align-items-center mt-3'>
                    <h1>Checking bukti transfer</h1>
                </div>
                <div className='pt-3' style={{paddingLeft:'5%', paddingRight:'5%'}}>
                    <Paper >
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID. Pembelian</TableCell>
                                        <TableCell>Total Harga</TableCell>
                                        <TableCell>Bukti Transfer</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>

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
 
export default connect(MapstatetoProps) (ProfileAdmin);