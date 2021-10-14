import { RECEIVE_SERVICES } from "../actions/categories"
import { RECEIVE_STAFF } from "../actions/categories"

export function categories(state ={}, action){
  const services= 'services'
  const staff= 'staff'
  switch(action.type){
        case RECEIVE_SERVICES:
          return {
              ...state,
              [services]:{
                ...state[services],
                ...action.services
              }
          }
        case RECEIVE_STAFF:
          return {
              ...state,
              [staff]:{
                ...state[staff],
                ...action.staff
              }
          }
        default:
            return state
    }
}

