import {formatQuestion} from './helpers'
import{db} from '../index'
const mysql = require("mysql");


// establish connection parameters to foods database
export const db = mysql.createConnection({
  host: "byun.eunostus.dreamhost.com",
  user: "hazim",
  password: "Meandhim1",
  database: "sinatoursdb"
});

// connect to foods database
db.connect((err) => {
  if (err) {
      throw err;
  }
  console.log("Connected to database");
});


global.db = db;
let users = {
  sarahedo: {
    id: 'sarahedo',
    name: 'Sarah Edo',
    avatarURL: 'https://nofiredrills.com/wp-content/uploads/2016/10/myavatar.png',
    answers: {
      "8xf0y6ziyjabvozdd253nd": 'optionOne',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo',
      "am8ehyc8byjqgar0jgpub9": 'optionTwo',
      "loxhs1bqm25b708cmbf3g": 'optionTwo'
    },
    questions: ['8xf0y6ziyjabvozdd253nd', 'am8ehyc8byjqgar0jgpub9']
  },
  tylermcginnis: {
    id: 'tylermcginnis',
    name: 'Tyler McGinnis',
    avatarURL: 'https://i.kinja-img.com/gawker-media/image/upload/ijsi5fzb1nbkbhxa2gc1.png',
    answers: {
      "vthrdm985a262al8qx3do": 'optionOne',
      "xj352vofupe1dqz9emx13r": 'optionTwo',
    },
    questions: ['loxhs1bqm25b708cmbf3g', 'vthrdm985a262al8qx3do'],
  },
  johndoe: {
    id: 'johndoe',
    name: 'John Doe',
    avatarURL: 'https://www.mlive.com/resizer/BOBl7UX3wLcZWffONPeu9gUCn4M=/700x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/ETSJBFFEBNBCDG6BVGJWPZMVPI.jpg',
    answers: {
      "xj352vofupe1dqz9emx13r": 'optionOne',
      "vthrdm985a262al8qx3do": 'optionTwo',
      "6ni6ok3ym7mf1p33lnez": 'optionTwo'
    },
    questions: ['6ni6ok3ym7mf1p33lnez', 'xj352vofupe1dqz9emx13r'],
  }
}

let questions = {
  "8xf0y6ziyjabvozdd253nd": {
    id: '8xf0y6ziyjabvozdd253nd',
    author: 'sarahedo',
    timestamp: 1467166872634,
    optionOne: {
      votes: ['sarahedo'],
      text: 'have horrible short term memory',
    },
    optionTwo: {
      votes: [],
      text: 'have horrible long term memory'
    }
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: '6ni6ok3ym7mf1p33lnez',
    author: 'johndoe',
    timestamp: 1468479767190,
    optionOne: {
      votes: [],
      text: 'become a superhero',
    },
    optionTwo: {
      votes: ['johndoe', 'sarahedo'],
      text: 'become a supervillain'
    }
  },
  "am8ehyc8byjqgar0jgpub9": {
    id: 'am8ehyc8byjqgar0jgpub9',
    author: 'sarahedo',
    timestamp: 1488579767190,
    optionOne: {
      votes: [],
      text: 'be telekinetic',
    },
    optionTwo: {
      votes: ['sarahedo'],
      text: 'be telepathic'
    }
  },
  "loxhs1bqm25b708cmbf3g": {
    id: 'loxhs1bqm25b708cmbf3g',
    author: 'tylermcginnis',
    timestamp: 1482579767190,
    optionOne: {
      votes: [],
      text: 'be a front-end developer',
    },
    optionTwo: {
      votes: ['sarahedo'],
      text: 'be a back-end developer'
    }
  },
  "vthrdm985a262al8qx3do": {
    id: 'vthrdm985a262al8qx3do',
    author: 'tylermcginnis',
    timestamp: 1489579767190,
    optionOne: {
      votes: ['tylermcginnis'],
      text: 'find $50 yourself',
    },
    optionTwo: {
      votes: ['johndoe'],
      text: 'have your best friend find $500'
    }
  },
  "xj352vofupe1dqz9emx13r": {
    id: 'xj352vofupe1dqz9emx13r',
    author: 'johndoe',
    timestamp: 1493579767190,
    optionOne: {
      votes: ['johndoe'],
      text: 'write JavaScript',
    },
    optionTwo: {
      votes: ['tylermcginnis'],
      text: 'write Swift'
    }
  },
}


export function _getTable (table, filter=undefined) {
  return new Promise((res, rej) => {
    // get the search keyword inserted by user
    // let word = type;
    // search the database for the keyword
    let sqlquery = filter ? `SELECT * FROM ${table} Where position='${filter}'`
                          : `SELECT * FROM ${table}`;
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            // display a message when the keyword was not found in the database
            return console.error(err.message);
        } else if (result.length == 0){
          return console.error("No data is available");
        } else {
          res({...result})
        }
    });
  })
}

export function _getTableColumns (table) {
  return new Promise((res, rej) => {
    let sqlquery = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE
                    TABLE_SCHEMA = Database() AND TABLE_NAME = '${table}'`;
    db.query(sqlquery, (err, result) => {
        if (err) {
            // display a message when the keyword was not found in the database
            return console.error(err.message);
        } else if (result.length == 0){
          return console.error("No data is available");
        } else {
          res({...result})
        }
    });
  })
}

export function _addTableRow (table, row) {
  return new Promise((res, rej) => {
    let keys = Object.keys(row);
    let kMarks=''
    for(let key of keys){
      kMarks+='? , ';
    }
    let values = keys.map((key)=> row[key]);
    let qMarks=''
    for(let value of values){
      qMarks+='? , ';
    }
    let sqlquery = `INSERT INTO ${table} ( ${kMarks.substring(0, kMarks.length - 2)}) VALUES ( ${qMarks.substring(0, qMarks.length - 2)});`;
    // let values = [value];
    let keysF =[]
    for(let key of keys){
      let val = '"'+key+'"'
      keysF.push(val.replace(/['"]+/g, ""))
    }
    let all = keysF.concat(values)
    let query = db.query(sqlquery, all).sql
    let queryStart = query.substring(0, query.indexOf("VALUES")).replace(/['"]+/g, '')
    let queryFinal = queryStart + query.substring(query.indexOf("VALUES"))

    console.log(queryFinal)
    db.query(queryFinal, (err, result) => {
        if (err || result.length == 0) {
            // display a message when the keyword was not found in the database
            console.log("Data not successfully")
            return console.error(err.message);
        } else {
          console.log("Data added successfully")
          res("Data added successfully")
        }
    });
  })
}

export function _removeTableRow (table, rowId) {
  return new Promise((res, rej) => {
    let sqlquery = `DELETE FROM ${table} WHERE id = ?`;
    db.query(sqlquery, rowId, (err, result) => {
        if (err || result.length == 0) {
            // display a message when the keyword was not found in the database
            return console.error(err.message);
        } else {
          res("Data removed successfully")
        }
    });
  })
}

export function _updateTableRow (table, row, rowId) {
  return new Promise((res, rej) => {
    let keys = Object.keys(row);
    let stringArray = keys.map((key)=> `${key} = ${row[key]}`);
    let string = '';
    stringArray.forEach((str)=>{string+=str})
    let sqlquery = `UPDATE ${table} SET ${string} WHERE id = ${rowId}`;
    db.query(sqlquery, (err, result) => {
        if (err || result.length == 0) {
            // display a message when the keyword was not found in the database
            return console.error(err.message);
        } else {
          res("Data updated successfully")
        }
    });
  })
}


// export function _getStaff () {
//   return new Promise((res, rej) => {
//     setTimeout(() => res({...users}), 1000)
//   })
// }

export function _getUsers () {
  return new Promise((res, rej) => {
    setTimeout(() => res({...users}), 1000)
  })
}

export function _getQuestions () {
  return new Promise((res, rej) => {
    setTimeout(() => res({...questions}), 1000)
  })
}

export function _saveQuestion (question) {
  return new Promise((res, rej) => {
    const authedUser = question.author;
    const formattedQuestion = formatQuestion(question);

    setTimeout(() => {
      questions = {
        ...questions,
        [formattedQuestion.id]: formattedQuestion
      }

      users = {
        ...users,
        [authedUser]: {
          ...users[authedUser],
          questions: users[authedUser].questions.concat([formattedQuestion.id])
        }
      }

      res(formattedQuestion)
    }, 1000)
  })
}

export function _saveQuestionAnswer ({ authedUser, qid, answer }) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      users = {
        ...users,
        [authedUser]: {
          ...users[authedUser],
          answers: {
            ...users[authedUser].answers,
            [qid]: answer
          }
        }
      }

      questions = {
        ...questions,
        [qid]: {
          ...questions[qid],
          [answer]: {
            ...questions[qid][answer],
            votes: questions[qid][answer].votes.concat([authedUser])
          }
        }
      }

      res()
    }, 500)
  })
}

