const initial_state ={
    email:'',
    password:'',
    cart: []
}

export const userreducer = (state = initial_state, action)=>{
    switch (action.type){
        case 'log_in':
            return{
                ...state,
                id:action.payload.id,
                email: action.payload.email,
                password : action.payload.password,
                cart : action.payload.cart
            }
        case 'log-out':
            return initial_state
        default:
            return state
    }
} 