import {combineReducers} from 'redux'
import authedUser from './authedUser'
import users from './users'
import {categories} from './categories'
import { data } from './data'
import { loadingBarReducer } from 'react-redux-loading'

export default combineReducers({
    authedUser,
    users,
    categories,
    data,
    loadingBar: loadingBarReducer
})
