export const login = (data) =>{
    return {
        type: 'log_in',
        payload: data
    }
}

export const logout = () => {
    return{
        type: 'log_in'
    }
}