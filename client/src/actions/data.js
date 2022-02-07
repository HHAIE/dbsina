import { getTableData, getTableColumns, addTableRow, removeTableRow, updateTableRow } from "../utils/api"
import { showLoading, hideLoading } from "react-redux-loading"
import { receiveUsers } from "./users"

export const RECEIVE_DATA = 'RECEIVE_DATA'
export const ADD_DATA = 'ADD_DATA'
export const REMOVE_DATA = 'REMOVE_DATA'
export const UPDATE_DATA = 'UPDATE_DATA'


function getData(data, dataCategory){
  return{
      type: RECEIVE_DATA,
      data,
      dataCategory
  }
}

function addData(table, row){
  return{
      type: ADD_DATA,
      table,
      row
  }
}

function removeData(table, rowId){
  return{
      type: REMOVE_DATA,
      table,
      rowId
  }
}

function updateData(table, row, rowId){
  return{
      type: UPDATE_DATA,
      table,
      row,
      rowId
  }
}

export function handleGetData(table, category){
  return(dispatch, getState)=>{
      // const {authedUser}=getState()

      dispatch(showLoading())
      return getTableData(table, category)
        .then((data)=>dispatch(getData(data, table)))
        .then(()=> dispatch(hideLoading()))
  }
}

export function handleAddData(table, row, category){
  // console.log(row)
  return (dispatch)=>{
      // const {authedUser}=getState()
      console.log(row)

      dispatch(showLoading())
      if (table !== "adminUsers"){
        return addTableRow(table, row)
          .then(()=>getTableData(table, category && category))
          .then((data)=>dispatch(getData(data, table)))
          .then(()=> dispatch(hideLoading()))
      } else {
        return addTableRow(table, row)
          .then(()=>getTableData(table, category && category))
          .then((data)=>dispatch(receiveUsers(data, table)))
          .then(()=> dispatch(hideLoading()))
      }
      
  }
}

export function handleRemoveData(table, rowId, category){
  return(dispatch, getState)=>{
      // const {authedUser}=getState()
      console.log(table)
      dispatch(showLoading())
      return removeTableRow(table, rowId)
        .then(()=>getTableData(table, category && category))
        .then((data)=>dispatch(getData(data, table)))
        .then(()=> dispatch(hideLoading()))
  }
}

export function handleUpdateData(table, row, rowId, category){
  // console.log(row)
  return (dispatch)=>{
    // const {authedUser}=getState()
    console.log(row)
    console.log(table)
    console.log(category)
    console.log(rowId)

    dispatch(showLoading())
    if (table !== "adminUsers"){
      return updateTableRow(table, row, rowId)
        .then(()=>getTableData(table, category && category))
        .then((data)=>dispatch(getData(data, table)))
        .then(()=> dispatch(hideLoading()))
    } else {
      return updateTableRow(table, row, rowId)
        .then(()=>getTableData(table, category && category))
        .then((data)=>dispatch(receiveUsers(data, table)))
        .then(()=> dispatch(hideLoading()))
    }
    
}
}



export async function handleGetTableC(table){

  let output =  await getTableColumns(table).then((data)=>{return data})
  console.log(output)
  return output
}

export const languagesOptions = [
  { value: "Arabic", label: "Arabic"},
  { value: "Albanian", label: "Albanian" },
  { value: "Bengali", label: "Bengali"},
  { value: "Chinese", label: "Chinese"},
  { value: "Dutch", label: "Dutch"},
  { value: "English", label: "English"},
  { value: "French", label: "French"},
  { value: "German", label: "German"},
  { value: "Greek", label: "Greek",},
  { value: "Guarani", label: "Guarani"},
  { value: "Hindi", label: "Hindi"},
  { value: "Italian", label: "Italian"},
  { value: "Korean", label: "Korean"},
  { value: "Malay", label: "Malay"},
  { value: "Persian", label: "Persian"},
  { value: "Portuguese", label: "Portuguese"},
  { value: "Romanian", label: "Romanian"},
  { value: "Russian", label: "Russian"},
  { value: "Serbo-Croatian", label: "Serbo-Croatian"},
  { value: "Spanish", label: "Spanish"},
  { value: "Swahili", label: "Swahili"},
  { value: "Swedish", label: "Swedish"},
  { value: "Tamil", label: "Tamil"},
  { value: "Turkish", label: "Turkish"}
]
