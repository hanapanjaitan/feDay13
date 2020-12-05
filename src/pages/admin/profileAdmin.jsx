import React, { Component } from 'react';
import Header from '../../component/Header';
import { connect } from 'react-redux';
import Axios from 'axios'
import { API_URL, API_URL_SQL, priceFormatter } from '../../helpers/idrformat';
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
import {BiArrowBack, BiEditAlt} from 'react-icons/bi'

class ProfileAdmin extends Component {
    state = { 
        historyUser : [],
        indexDetails: 0
    }

    componentDidMount(){
        console.log(this.props.id)
        // http://localhost:4000/transactions?status=WaitingAdmin&_embed=transactionDetails
        Axios.get(`${API_URL_SQL}/trans/getWaitingApprove`)
        .then((res)=>{
            console.log(res.data.length)
            // console.log(res.data[0].userId)
            console.log(res.data)
            this.setState({historyUser:res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onAcceptClick=(index)=>{
        Axios.get(`${API_URL}/transactions`)
        .then((res)=>{
            var indexProd = res.data.findIndex((val)=>{
                return val.status == 'WaitingAdmin' && val.id == this.state.historyUser[index].id
            })
            Axios.patch(`${API_URL}/transactions/${indexProd+1}`,{
                status: "Completed"
            }).then((res2)=>{
                Axios.get(`${API_URL}/transactions`,{
                    params:{
                        status: "WaitingAdmin",
                        _embed:'transactionDetails'
                    }
                })
                .then((res3)=>{
                    console.log(res.data.length)
                    // console.log(res.data[0].userId)
                    console.log(res.data)
                    alert('berhasil accept bukti transfer')
                    this.setState({historyUser:res3.data})
                }).catch((err)=>{
                    console.log(err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{

        })
    }

    renderTotalHarga=(index)=>{
        var total= this.state.historyUser[index].transactionDetails.reduce((total, num)=>{
            return total + (num.price * num.qty)
        },0)

        return total
    }

    renderCekBuktiTransfer=()=>{
        return this.state.historyUser.map((val, index)=>{
            return (
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'200px'}}>
                            <img width='100%' heigth='100%' src={val.buktiPembayaran} alt={val.id}/>
                        </div>
                    </TableCell>
                    <TableCell>{priceFormatter(this.renderTotalHarga(index))}</TableCell>
                    <TableCell>{val.status}</TableCell>
                    <TableCell>
                        <ButtonUi onClick={()=>this.onAcceptClick(index)}>Accept</ButtonUi>
                    </TableCell>
                </TableRow>
            )
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
                                        <TableCell>No.</TableCell>
                                        <TableCell>Bukti Transfer</TableCell>
                                        <TableCell>Total Harga</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.renderCekBuktiTransfer()}
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