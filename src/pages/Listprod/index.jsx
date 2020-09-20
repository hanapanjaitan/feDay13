import React, { Component } from 'react';
import Header from '../../component/Header'
import './listprod.css'
import {
    Breadcrumb, BreadcrumbItem, Card, CardImg
} from 'reactstrap'
import Axios from 'axios'
import { API_URL, priceFormatter } from '../../helpers/idrformat';
import { Link } from 'react-router-dom';

class ListProd extends Component {
    state = { 
        Products: []
     }
    componentDidMount(){
        Axios.get(`${API_URL}/products`)
        .then((res)=>{
            this.setState({Products:res.data})
        }).catch((err)=>{
            console.log(err) 
        })
    }

    renderCard=()=>{
        return this.state.Products.map((val)=>{
            return(
                <div key={val.id} className="col-md-3 p-2">
                    <Link to={'/products/' + val.id}>
                        <Card className='kartu card-rounded'>
                            <CardImg className='card-rounded' top width="100%" height={200} src={val.gambar} alt="Card image cap" />
                            <div className='overlay card-rounded'>
                                <div className='text'>
                                    <div>
                                        {val.namatrip}
                                    </div>
                                    <div>
                                        {priceFormatter(val.harga)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                </div>
            )
        })
    }

    render() { 
        return ( 
            <div>
                <Header/>
                <div className='pt-3 px-4'>
                    <Breadcrumb className='transparent m-0 px-2'>
                        <BreadcrumbItem > <Link className='link-class' to='/'>Home</Link> </BreadcrumbItem>
                        <BreadcrumbItem active> <Link className='link-class' to='/'>Products</Link> </BreadcrumbItem>
                    </Breadcrumb>
                    <div className="row p-0 m-0">
                        {this.renderCard()}
                    </div>
                </div>
            </div>
         );
    }
}
 
export default ListProd;