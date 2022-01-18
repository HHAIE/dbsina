import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'
import middleware from './middleware'
import 'semantic-ui-css/semantic.min.css'

// const mysql = require("mysql");


// establish connection parameters to foods database
// export const db = mysql.createConnection({
//   host: "byun.eunostus.dreamhost.com",
//   user: "hazim",
//   password: "Meandhim1",
//   database: "sinatoursdb"
// });

// // connect to foods database
// db.connect((err) => {
//   if (err) {
//       throw err;
//   }
//   console.log("Connected to database");
// });


// global.db = db;

const store = createStore(reducer, middleware)

ReactDOM.render(
<Provider store={store}>
<App />
</Provider>, document.getElementById('root'))