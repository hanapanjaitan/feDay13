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
            <Link to='/manageAdmin' style={{textDecoration:'none', color:'white'}}>
              <Button color="inherit">Admin</Button>
            </Link>
            :
            props.role === 'user'?
            <Link to='/carts' style={{textDecoration:'none', color:'white'}}>
              <Button color="inherit" >
                <IconButton aria-label="cart">
                  <StyledBadge badgeContent={props.cart.length} color="secondary">
                    <ShoppingCartIcon />
                  </StyledBadge>
                </IconButton>
              </Button>
          </Link>
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
              <MenuItem >Setting</MenuItem>
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