import {ADDCART, ADDHISTORY} from './../Type'

const INITIAL_STATE={
    username: '',
    password: '',
    id: 0,
    isLogin: false,
    error:'',
    isLoading:false,
    cart: [],
    history: []
}

export default (state=INITIAL_STATE, action)=>{
    switch (action.type) {
        case 'LOGIN':
            return {...state, ...action.payload, isLogin:true, isLoading:false, cart:action.cart}
        case 'LOGOUT':
            return INITIAL_STATE
        case 'Error':
            return {...state, error:'error message dari redux', isLoading:false}
        case 'LOADING':
            return {...state, isLoading: true}
        case 'CLEAR':
            return {...state, isLoading: false, error:''}
        case ADDCART:
            return {...state, cart: action.cart}
        case ADDHISTORY:
            return {...state, history: action.history}
        default:
            return state
    }
}