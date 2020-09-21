import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {FaUserCircle, FaCartArrowDown} from 'react-icons/fa'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {LogoutThunk} from './../redux/Actions'
import {HOME_URL} from './../helpers/idrformat'
import Box from '@material-ui/core/Box';
import Popover from '@material-ui/core/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { ButtonUi } from '.';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  warna:{
      color: 'black',
      background: '#ff7961'
    //   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'

  }
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    color:'white',
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}))(Badge);


function ButtonAppBar(props) {
  const classes = useStyles();
  const [anchorEl, setOpen] = useState(null);

  const onLogoutClick=()=>{
    console.log(props.username, props.password)
    localStorage.clear()
    window.location.reload()
    window.location.assign(`${HOME_URL}`)
    // LogoutThunk(props.username, props.password)
  }

  const renderCart=()=>{
    return props.cart.map((val)=>{
      return (
        <div className='d-flex '>
          <div className='m-2' style={{maxWidth:'200px'}}>
            <img width='100%' heigth='100%' src={val.product.gambar} alt={val.product.namatrip}/>
          </div>
          <div className='m-2'>
            {val.product.namatrip}
          </div>
          <div className='m-2'>
            qty: {val.qty}
          </div>
        </div>
      )
    })
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.warna} position="static">
        <Toolbar>
            <a href={HOME_URL} style={{textDecoration:'none', color:'black'}}>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <FlightTakeoffIcon />
                </IconButton>
            </a>
          <Typography variant="h6" className={classes.title}>
            Volatare Trip
          </Typography>
          {
            props.role === 'admin' ?
            <>
            <Link to='/profileAdmin' style={{textDecoration:'none', color:'white'}}>
              <Button color="inherit">Manage Transaksi</Button>
            </Link>
            <Link to='/manageAdmin' style={{textDecoration:'none', color:'white'}}>
              <Button color="inherit">Manage Products</Button>
            </Link>
            </>
            :
            props.role === 'user'?
            <>
              <PopupState variant="popover" popupId="demo-popup-popover">
              {(popupState) => (
                <div>
                  <Button variant="contained" color="primary" {...bindTrigger(popupState)}>
                    <IconButton aria-label="cart">
                      <StyledBadge badgeContent={props.cart.length} color="secondary">
                        <ShoppingCartIcon />
                      </StyledBadge>
                    </IconButton>
                  </Button>
                  <Popover
                    {...bindPopover(popupState)}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <Box p={6}>
                      <Typography>
                        {
                        props.cart.length ? 
                        <>
                        {renderCart()} 
                        <Link to='carts'>
                          <ButtonUi>Go to cart</ButtonUi>
                        </Link>
                        </>
                        :
                         'empty carts'
                         }
                        
                      </Typography>
                    </Box>
                  </Popover>
                </div>
              )}
            </PopupState>
              <Link to='/profile' style={{textDecoration:'none', color:'white'}}>
                <Button color="inherit" >HISTORY</Button>
              </Link>
            </>
            :
            null
          }
          {
            props.isLogin ?
            <>
              <Button color="inherit" onClick={(e)=>setOpen(e.currentTarget)}><FaUserCircle/>&nbsp;{props.username}</Button>
              <Menu
              // id="simple-menu"
              anchorEl={anchorEl}
              // keepMounted
              open={Boolean(anchorEl)}
              onClose={()=>setOpen(null)}
              >
              <Link to= {props.role === 'admin' ? '/profileAdmin' : '/profile' } >
                <MenuItem style={{textDecoration:'none', color:'black'}}>Profile</MenuItem>
              </Link>
              <Link to= {props.role === 'admin' ? null : '/setting' } >
                <MenuItem style={{textDecoration:'none', color:'black'}}>Setting</MenuItem>
              </Link>
              <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
              </Menu>
            </>
            :
            <Link to='/login' style={{textDecoration:'none', color:'white'}}>
              <Button color="inherit">Login</Button>
            </Link>

          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

const MapstatetoProps=({Auth})=>{
  return {
    ...Auth, role: Auth.role
  }
}
export default connect(MapstatetoProps, {LogoutThunk}) (ButtonAppBar);