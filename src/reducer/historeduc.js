export const historyreducer = (state= [], action)=>{
    switch(action.type){
        case "GET_HISTORY":
            return action.payload
            default:
                return state
    }
}