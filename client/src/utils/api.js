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
  ]).then(([categories, users]) => ({
    categories,
    users,
  }))
}

export function getTableData (info) {
  let url = new URL('getTable', fetchingURL)
  url.search = new URLSearchParams({
      table: info
  })

  var myHeaders = new Headers();
  myHeaders.append('pragma', 'no-cache');
  myHeaders.append('cache-control', 'no-cache');

  var myInit = {
    method: 'GET',
    headers: myHeaders,
  };
  return fetch(url, myInit)
  .then((res) => res.json())
  .then((tableData)=>({...tableData
  }))
}

export function addTableRow (table, row) {
  let url = new URL('addTableRow', fetchingURL)
  row.append('table', table)
  return fetch(url, {
    method: 'POST',
    body: row,
  })
}

export function removeTableRow (table, rowId) {
  let url = new URL('removeTableRow', fetchingURL)
  url.search = new URLSearchParams({
      table: table,
      rowId: rowId
  })

  return fetch(url)
}

export function updateTableRow (table, row, rowId) {
  let url = new URL('updateTableRow', fetchingURL)
  row.append('table', table)
  console.log(rowId)
  row.append('id', rowId)
  return fetch(url, {
    method: 'POST',
    body: row,
  })
}

export function getTableColumns (info) {
  let url = new URL('getTableColumn', fetchingURL)
  url.search = new URLSearchParams({
      table: info
  })

  var myHeaders = new Headers();
  myHeaders.append('pragma', 'no-cache');
  myHeaders.append('cache-control', 'no-cache');

  var myInit = {
    method: 'GET',
    headers: myHeaders,
  };
  return fetch(url, myInit)
  .then((res) => res.json())
  .then((tableData) => ( tableColumnsArray(tableData)))
}

// export function saveQuestionAnswer (info) {
//   return _saveQuestionAnswer(info)
// }

// export function saveQuestion (info) {
//   return _saveQuestion(info)
// }
