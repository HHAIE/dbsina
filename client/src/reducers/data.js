import { RECEIVE_DATA, ADD_DATA, UPDATE_DATA, REMOVE_DATA} from "../actions/data"

export function data(state ={}, action){
  const {dataCategory, table, row, rowId}= action
  switch(action.type){
        case RECEIVE_DATA:
          return {
              ...state,
              [dataCategory]:{
                // ...state[dataCategory],
                ...action.data
              }
          }
          // case ADD_DATA:
          // return {
          //     ...state,
          //     [table]:{
          //       ...state[table],
          //       [row.id]: row,
          //     }
          // }
          // return{
          //     ...state,
          //     [question.id]: question,
          // }
          // case UPDATE_DATA:
          // return {
          //     ...state,
          //     [dataCategory]:{
          //       ...state[dataCategory],
          //       ...action.data
          //     }
          // }
          // case REMOVE_DATA:
          // return {
          //     ...state,
          //     [dataCategory]:{
          //       ...state[dataCategory],
          //       ...action.data
          //     }
          // }
        default:
            return state
    }
}

