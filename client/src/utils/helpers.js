// import React from "react";
// import namor from "namor";
// import "./index.css";

// const range = len => {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(i);
//   }
//   return arr;
// };

// const newPerson = () => {
//   const statusChance = Math.random();
//   return {
//     firstName: namor.generate({ words: 1, numbers: 0 }),
//     lastName: namor.generate({ words: 1, numbers: 0 }),
//     age: Math.floor(Math.random() * 30),
//     visits: Math.floor(Math.random() * 100),
//     progress: Math.floor(Math.random() * 100),
//     status:
//       statusChance > 0.66
//         ? "relationship"
//         : statusChance > 0.33 ? "complicated" : "single"
//   };
// };

// export function makeData(len = 5553) {
//   return range(len).map(d => {
//     return {
//       ...newPerson(),
//       children: range(10).map(newPerson)
//     };
//   });
// }

// export const Logo = () =>
//   <div style={{ margin: '1rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
//     For more examples, visit {''}
//   <br />
//     <a href="https://github.com/react-tools/react-table" target="_blank">
//       <img
//         src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
//         style={{ width: `150px`, margin: ".5em auto .3em" }}
//       />
//     </a>
//   </div>;

// export const Tips = () =>
//   <div style={{ textAlign: "center" }}>
//     <em>Tip: Hold shift when sorting to multi-sort!</em>
//   </div>;





// ///////////////////////////////////////////////////////
export function formatDate (timestamp) {
  const d = new Date(timestamp)
  const time = d.toLocaleTimeString('en-US')
  return time.substr(0, 5) + time.slice(-2) + ' | ' + d.toLocaleDateString()
}


////////////////////////////////

function generateUID () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function formatQuestion ({ optionOneText, optionTwoText, author }) {
  return {
    id: generateUID(),
    timestamp: Date.now(),
    author,
    optionOne: {
      votes: [],
      text: optionOneText,
    },
    optionTwo: {
      votes: [],
      text: optionTwoText,
    }
  }
}

export function truncateText (str) {
  return str.length > 30 ? "..." + str.substring(0, 7) + "..." : "..." + str + "...";
}

export function idToList(list){
  let resultList = {}
  for (let item in list){
    resultList[list[item].id]=list[item]
  }
  return resultList
}

export function tableColumnsArray(list){
  console.log(list)
  let resultList = []
  for (let item in list){
    resultList.push(list[item].COLUMN_NAME)
  }
  return resultList
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}