import {getInitialData} from '../utils/api'
import { setAuthedUser } from './authedUser'
import { receiveUsers } from './users'
import {receiveServices, receiveStaff} from './categories'
import { showLoading, hideLoading } from 'react-redux-loading'


export function handleInitialData(){
    return(dispatch) => {
        dispatch(showLoading())
        return getInitialData()
            .then(({categories, users, questions})=>{
                console.log(categories)
                dispatch(receiveStaff(categories.staff))
                dispatch(receiveServices(categories.services))
                dispatch(receiveUsers(users))
                dispatch(hideLoading())
            })
    }
}
