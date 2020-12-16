import {combineReducers} from 'redux'

import {userreducer} from './ureduc'
import {historyreducer} from './historeduc'

const semuareducer = combineReducers({
    user : userreducer,
    history : historyreducer
})

export default semuareducer