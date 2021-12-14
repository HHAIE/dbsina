// import {
//   _getTable,
//   _getTableColumns,
//   _getQuestions,
//   _saveQuestionAnswer,
//   _saveQuestion,
//   _addTableRow,
//   _removeTableRow,
//   _updateTableRow
// } from './_DATA.js'

import {idToList, tableColumnsArray} from './helpers'
// let fetchingURL = 'https://localhost:3001/'
let fetchingURL = 'https://database.sinatoursegypt.com/'

const categories= (cat1, cat2)=>{
  let output={}
  
  let url = new URL('getTable', fetchingURL)
  url.search = new URLSearchParams({
      table: cat1
  })

  return fetch(url)
  .then((res) => res.json())
  .then((services)=>output["services"]=services)
  .then(()=>{
    let url = new URL('getTable', fetchingURL)
    url.search = new URLSearchParams({
        table: cat2
    })

    return fetch(url)
    .then((res) => res.json())
    .then((staff)=> output["staff"]=staff)
    .then(()=>{
      console.log(output)
      return output
    })
  })
}

const adminUsers= (user1)=>{
  let url = new URL('getTable', fetchingURL)
  url.search = new URLSearchParams({
      table: user1
  })

  return fetch(url)
  .then((res) => res.json())
  .then((users)=>idToList(users))
}

export function getInitialData () {
  return Promise.all([
    categories("Services", "StaffCategories"),
    adminUsers("adminUsers"),
    // _getQuestions(),
  ]).then(([categories, users]) => ({
    categories,
    users,
    // questions,
  }))
}

export function getTableData (info) {
  let url = new URL('getTable', fetchingURL)
  url.search = new URLSearchParams({
      table: info
  })

  return fetch(url)
  .then((res) => res.json())
  .then((tableData)=>({...tableData
  }))
}

export function addTableRow (table, row) {
  let url = new URL('addTableRow', fetchingURL)
  // url.search = new URLSearchParams({
  //     table: table,
  //     row: row
  // })
  row.append('table', table)
  return fetch(url, {
    method: 'POST',
    body: row,
    // headers: {
    //   'Content-type': 'multipart/form-data'
    // }
  })
  // .then((res) => res.json())
  // .then((resMsg) => (resMsg))
}

export function removeTableRow (table, rowId) {
  let url = new URL('removeTableRow', fetchingURL)
  url.search = new URLSearchParams({
      table: table,
      rowId: rowId
  })

  return fetch(url)
  // .then((res) => res.json())
  // .then((resMsg) => (resMsg))
}

export function updateTableRow (table, row, rowId) {
  let url = new URL('updateTableRow', fetchingURL)
  url.search = new URLSearchParams({
      table: table,
      row: row,
      rowId: rowId
  })

  return fetch(url)
  // .then((res) => res.json())
  // .then((resMsg) => (resMsg))
}

export function getTableColumns (info) {
  let url = new URL('getTableColumn', fetchingURL)
  url.search = new URLSearchParams({
      table: info
  })

  return fetch(url)
  .then((res) => res.json())
  .then((tableData) => ( tableColumnsArray(tableData)))
}

// export function saveQuestionAnswer (info) {
//   return _saveQuestionAnswer(info)
// }

// export function saveQuestion (info) {
//   return _saveQuestion(info)
// }
