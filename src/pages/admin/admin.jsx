import React, {Component, useState, useRef, useReducer, useEffect} from 'react';
import Header from '../../component/Header'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {MdDeleteForever} from 'react-icons/md'
import {BiEditAlt, BiPlusCircle} from 'react-icons/bi'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput } from 'reactstrap';
import axios from 'axios'
import { API_URL, API_URL_SQL, priceFormatter } from '../../helpers/idrformat';
import ButtonUI from './../../component/button'
import {connect} from 'react-redux'
import Notfound from './../notfound'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useForkRef } from '@material-ui/core';
import Axios from 'axios';

const ipsum = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat molestias eos repellendus dolore suscipit, harum ea sit cumque. Aperiam labore exercitationem hic numquam inventore deserunt at vero rerum a corporis.'

const MySwal = withReactContent(Swal)


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

function StickyHeadTable(props) {
  const [modal, setModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalFoto, setModalFoto] = useState(false)
  const [fotos, setfotos] = useState([null])
  const classes = useStyles();
  const [banner, setBanner] = useState(null)
  const [idProdSelect, setIdProdSelect] = useState(0)

  const [editform, seteditform] = useState({
    namaTrip: useRef(),
    gambar: null,
    tanggalStart: useRef(),
    tanggalEnd: useRef(),
    harga: '',
    deskripsi: useRef()
  })

  const [addform, setaddform] = useState({
    namaTrip: useRef(),
    tanggalStart: useRef(),
    tanggalEnd: useRef(),
    harga: '',
    deskripsi: useRef(),
    capacity: useRef()
  })

  const [indexEdit, setIndexEdit] = useState(0)
  const [indexDelete, setIndexDelete] = useState(0)
  const [product, setProduct] = useState([])

  useEffect(()=>{
    axios.get(`${API_URL_SQL}/product/getProduct`)
    .then((res)=>{
      setProduct(res.data)
    }).catch((err)=>{
      console.log(err)
    })
  })

  const onInputFileChange=(e)=>{
    console.log(e.target.files)
    if (e.target.files[0]){
        console.log(e.target.files[0])
        setBanner(e.target.files[0])
    }else{
        console.log('hapus')
        setBanner(null)
    }
  }

  const onInputFileFotoChange=(e, index)=>{
    console.log(e.target.files)
    if (e.target.files[0]){
        console.log(e.target.files[0])
        let foto = fotos
        foto.splice(index, 1, e.target.files[0])
        setfotos([...foto])
    }else{
      // codingan untuk hapus foto di view
        console.log('hapus')
        let foto = fotos
        foto.splice(index, 1, null)
        setfotos([...foto])
    }
  }

  const onHargaChange=(e)=>{
    console.log(e.target.value)
    if(e.target.value === ''){
      setaddform({...addform, harga:0})
    }
    if(Number(e.target.value)){
      if(addform.harga===0){
        setaddform({...addform, harga:e.target.value[1]})
      }else{
        console.log(e.target.value)
        setaddform({...addform, harga:e.target.value})
      }
    }
  }

  const onHargaSetEditChange=(e)=>{
    if(e.target.value === ''){
      seteditform({...editform, harga:0})
    }
    if(Number(e.target.value)){
      if(editform.harga===0){
        seteditform({...editform, harga:e.target.value[1]})
      }else{
        seteditform({...editform, harga:e.target.value})
      }
    }
  }

  const dateformat=(n)=>{
    var today = new Date(n);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '-' + dd + '-' + yyyy;
    return today
  }

  const dateeditformat=(n)=>{
    var today = new Date(n);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
  }

  const readMore=(kata)=>{
    const hitungKata = kata.split(' ').filter((val)=>val!=='').length
    if(hitungKata>10){
      var kataArr = kata.split(' ').map((val,index)=>index<11?val:'')
      var kataFinal = kataArr.join(' ')
      return(
        <>
        {kataFinal}
        <span style={{color:'red'}}>Read more..</span>
        </>
      )
    }
    return kata
  }

  const onAddBanyakFoto=()=>{
    var formData = new FormData()
    var options = {
      headers: {
          'Content-type': 'multipart/form-data'
      }
    }
    fotos.forEach((val)=>{
      formData.append('image', val)
    })
    console.log(idProdSelect)
    formData.append('data', JSON.stringify({product_id: idProdSelect}))
    Axios.post(`${API_URL_SQL}/product/addProductFoto`, formData, options)
    .then((res)=>{
      console.log(res.data)
      alert('berhasil')
    }).catch((err)=>{
      console.log(err)
    })
  }

  const onAddDataClick=()=>{
    var formData = new FormData()
    var options = {
        headers: {
            'Content-type': 'multipart/form-data'
        }
    }
    var namaTrip = addform.namaTrip.current.value
    var tanggalStart = addform.tanggalStart.current.value
    var tanggalEnd = addform.tanggalEnd.current.value
    var harga = addform.harga
    var deskripsi = addform.deskripsi.current.value
    var capacity = addform.capacity.current.value
    var data = {
      namaproduct: namaTrip,
      tanggalmulai:new Date(tanggalStart).getTime(),
      tanggalberakhir:new Date(tanggalEnd).getTime(),
      harga,
      deskripsi,
      capacity
    }
    formData.append('image', banner)
    formData.append('data', JSON.stringify(data))
    if(data.tanggalStart>data.tanggalEnd || data.tanggalStart<new Date().getTime()){
      console.log('salahh')
    }else{
      axios.post(`${API_URL_SQL}/product/addProduct`, formData, options)
      .then((res)=>{
        console.log(res.data)
        alert('berhasil')
      }).catch((err)=>{
          console.log(err)
      })
    }
  }

  const onDeleteClick=(index, id)=>{
    // const {nama} =this.state.datamurid[index]
    MySwal.fire({
      title: `Are you sure want to delete ${product[index].namatrip} ?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        // console.log(id)
        axios.delete(`${API_URL}/products/${id}`)
        .then((res)=>{
          MySwal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }).catch((err)=>{
          console.log(err)
        })
      }
    })
  }



  
  const onEditClick=(index)=>{
    setIndexEdit(index)
    seteditform({...editform, harga: product[index].harga})
    setModalEdit(true) // buat apa yaaa
  }

  const onSaveEditClick=(id)=>{
    // var namatrip = addform.namaTrip.current.value
    // var gambar = addform.gambar.current.value
    // var tanggalStart = addform.tanggalStart.current.value
    // var tanggalEnd = addform.tanggalEnd.current.value
    // var harga = addform.harga
    // var deskripsi = addform.deskripsi.current.value
    // var objEdit = {
    //   namatrip,
    //   gambar,
    //   tanggalStart:new Date(tanggalStart).getTime(),
    //   tanggalEnd:new Date(tanggalEnd).getTime(),
    //   harga,
    //   deskripsi
    // }
    // var objEdit = {
    //   namatrip: editform.namaTrip.current.value,
    //   gambar: editform.gambar.current.value,
    //   tanggalStart: editform.tanggalStart.current.value,
    //   tanggalEnd: editform.tanggalEnd.current.value,
    //   harga: editform.harga,
    //   deskripsi: editform.deskripsi.current.value
    // }
    // axios.put(`${API_URL}/products/${id}`, objEdit)
    // .then((res)=>{
    //   axios.get(`${API_URL}/products`)
    //   .then((res)=>{
    //     setProduct(res.data)
    //     seteditform({...editform, harga: ''})
    //     setModalEdit(false)
    //   }).catch((err)=>{
    //     console.log(err)
    //   })
    // }).catch((err)=>{
    //   console.log(err)
    // })
  }

  // https://indonesia.tripcanvas.co/id/wp-content/uploads/sites/2/2018/10/4-1-Pantai-Sedahan-by-meettheexplorer_.jpg


  
  const toggle = () => {
    setModal(!modal)
    setBanner(null)
  }

  const toggleFoto = (id) => {
    setModalFoto(!modalFoto)
    setfotos([null])
    if(id) setIdProdSelect(id)
  }

  const toggleEdit = () => setModalEdit(!modalEdit)

  const tambahFoto=()=>{
    setfotos([...fotos, null])
  }

  const renderTable=()=>{
    return product.map((val,index)=>{
      return(
        <TableRow key={val.id}>
          <TableCell>{index+1}</TableCell>
          <TableCell>{val.namaproduct}</TableCell>
          <TableCell>
            <div style={{maxWidth:'200px'}}>
              <img width='100%' heigth='100%' src={API_URL_SQL + val.banner}/>
            </div>
          </TableCell>
          <TableCell>{dateformat(val.tanggalmulai)}</TableCell>
          <TableCell>{dateformat(val.tanggalberakhir )}</TableCell>
          <TableCell>{priceFormatter(val.harga)}</TableCell>
          <TableCell>{val.capacity}</TableCell>
          <TableCell>{val.deskripsi}</TableCell>
          <TableCell>
            <span style={{fontSize:30}} onClick={()=>onDeleteClick(index, val.id)} className='text-danger mr-3'><MdDeleteForever/></span>
            <span style={{fontSize:30}} onClick={()=>onEditClick(index)} className='text-primary ml-3'><BiEditAlt/></span>
            <span style={{fontSize:30}} onClick={()=>toggleFoto(val.id)} className='text-primary ml-3'><BiPlusCircle/></span>
            </TableCell>
        </TableRow>
      )
    })
  }

  return (
      <>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Add data</ModalHeader>
            <ModalBody>
                <input type='text' ref={addform.namaTrip} placeholder='Masukkan nama' className='form-control mb-2'/>
                <input type='file' onChange={onInputFileChange} className='form-control mb-2'/>
                {
                  banner ?
                  <div className='my-2'>
                    <img src={URL.createObjectURL(banner)} height='200' width='200' alt='foto'/>
                  </div>
                  : null
                }
                <label className='ml-1'>
                  Tanggal mulai
                </label>
                <input type='date' ref={addform.tanggalStart} placeholder='Masukkan tanggal mulai' className='form-control mb-2'/>
                <label className='ml-1'>
                  Tanggal berakhir
                </label>
                <input type='date' ref={addform.tanggalEnd} placeholder='Masukkan tanggal mulai' className='form-control mb-2'/>
                <input type='number' ref={addform.capacity} placeholder='Kapasitas' className='form-control mb-2'/>
                <input type='text' onChange={onHargaChange} value={addform.harga} placeholder='Rp....' className='form-control mb-2'/>
                <textarea ref={addform.deskripsi} className='form-control mb-2' cols='30' rows='7' placeholder='deskripsi'></textarea>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={onAddDataClick}>Do Something</Button>{' '}
                <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
      </Modal>
        {
          product.length ?
          <Modal isOpen={modalEdit} toggle={toggleEdit}>
            <ModalHeader toggle={toggleEdit}>Edit data {product.length?product[indexEdit].namatrip:''}</ModalHeader>
                <ModalBody>
                    <input type='text' defaultValue={product[indexEdit].namatrip} ref={editform.namaTrip} placeholder='Masukkan nama' className='form-control mb-2'/>
                    <input type='text' defaultValue={product[indexEdit].gambar} ref={editform.gambar} placeholder='Masukkan gambar' className='form-control mb-2'/>
                    <label className='ml-1'>
                      Tanggal mulai
                    </label>
                    <input type='date' defaultValue={dateeditformat(product[indexEdit].tanggalStart)} ref={editform.tanggalStart} placeholder='Masukkan tanggal mulai' className='form-control mb-2'/>
                    <label className='ml-1'>
                      Tanggal berakhir
                    </label>
                    <input type='date'  defaultValue={dateeditformat(product[indexEdit].tanggalEnd)} ref={editform.tanggalEnd} placeholder='Masukkan tanggal mulai' className='form-control mb-2'/>
                    <input type='text' onChange={onHargaSetEditChange} value={editform.harga} placeholder='Rp....' className='form-control mb-2'/>
                    <textarea defaultValue={product[indexEdit].deskripsi} ref={editform.deskripsi} className='form-control mb-2' cols='30' rows='7' placeholder='deskripsi'></textarea>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={()=>onSaveEditClick(product[indexEdit].id)}>Save</Button>{' '}
                    <Button color="secondary" onClick={toggleEdit}>Cancel</Button>
              </ModalFooter>
          </Modal>
          : null
        }
        <Modal isOpen={modalFoto} toggle={toggleFoto}>
          <ModalHeader toggle={toggleFoto}>Add Banyak Foto</ModalHeader>
          <ModalBody>
            {
              fotos.map((val, index)=>{
                if(val){
                  return (
                    <>
                      <CustomInput label={val.name} type='file' onChange={(e)=>onInputFileFotoChange(e,index)} className='form-control mb-2'/>
                      <div className='my-2'>
                        <img src={URL.createObjectURL(val)} height='200' width='200' alt="foto"/>
                      </div>
                    </>
                  )

                }
                return(
                  <>
                    <CustomInput type='file' onChange={(e)=>onInputFileFotoChange(e,index)} className='form-control'/>
                  </>
                )
              })
            }
            <BiPlusCircle onClick={tambahFoto}/>
          </ModalBody>
          <ModalFooter>
              <Button color="primary" onClick={onAddBanyakFoto}>Save</Button>{' '}
              <Button color="secondary" onClick={toggleFoto}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Header/>
        <div className='px-4'>
            <ButtonUI className="btn btn-outline-primary my-3" onClick={toggle}>
                Add data
            </ButtonUI>
            <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>Nama Trip</TableCell>
                    <TableCell style={{width:'200px'}}>Gambar</TableCell>
                    <TableCell>Tanggal Mulai</TableCell>
                    <TableCell>Tanggal Berakhir</TableCell>
                    <TableCell>Harga</TableCell>
                    <TableCell>Capacity</TableCell>
                    <TableCell style={{width:'300px'}}>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {renderTable()}
                </TableBody>
                </Table>
            </TableContainer>
            </Paper>

        </div>
      </>
  );
}

const MapstatetoProps=({Auth})=>{
  return {
    ...Auth, role: Auth.role
  }
}

export default connect(MapstatetoProps) (StickyHeadTable)