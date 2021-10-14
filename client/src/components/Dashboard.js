import { func } from 'assert-plus'
import { div } from 'prelude-ls'
import React, {Component} from 'react'
import { connect } from 'react-redux'
import Question from './Question'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { handleGetTableC } from '../actions/data'
import TableView from './TableView'


class Dashboard extends Component{
    state={
        answered: false,
        optimizedView: true,
        tableColumn: []
    }

    toggleAnswered=(e, answered)=>{
        this.setState(()=>{
          return{
            answered: answered,
          }
        })
    }
    toggleView= async (e, view)=>{
      const {currentTable}=this.props
      let columns = !view ? await handleGetTableC(currentTable)
                          : []
      console.log(columns)
      this.setState(()=>{
        return{
          tableColumn: columns,
          optimizedView: view
        }
      })
    }

    render(){
        const {answered, optimizedView, tableColumn} = this.state
        const {answeredQ, unansweredQ, dataShown, currentTable}=this.props
        return(
            <div className='dashboard'>
                {!dataShown ? <div className='toggle-questions'>
                    <span
                    className={`toggle-btn left ${answered && 'active'}`}
                    onClick={(e)=> this.toggleAnswered(e, true)}>
                        Services
                    </span>
                    <span
                    className={`toggle-btn right ${!answered && 'active'}`}
                    onClick={(e)=> this.toggleAnswered(e, false)}>
                        Staff
                    </span>
                </div>
                : <div className='toggle-questions'>
                      <span
                      className={`toggle-btn left ${optimizedView && 'active'}`}
                      onClick={(e)=> this.toggleView(e, true)}>
                          Optimized View
                      </span>
                      <span
                      className={`toggle-btn right ${!optimizedView && 'active'}`}
                      onClick={(e)=> this.toggleView(e, false)}>
                          Classic View
                      </span>
                  </div>}
                {optimizedView ? <div className='questions'>
                  { (dataShown!==null) ? Object.keys(dataShown).map((q)=>(<Question key={q} id={q} category={false}/>))
                  : answered ? answeredQ.map((q)=>(<Question key={q} id={q} category={true} type={"Services"}/>))
                            : unansweredQ.map((q)=>(<Question key={q} id={q} category={true} type={"Staff"}/>))}
                </div>
                : <TableView dataS={dataShown} tableColumns={tableColumn}/>}
            </div>
        )
    }
}

function mapStateToProps({questions, users, authedUser, categories, data}, props){
  const {type, servicename} = props.match.params
  let dataShown=null;
  if (type){
    console.log(type)
    console.log(servicename)
    console.log(data['Services'])
    dataShown = type==='Services' ? data[servicename]
                                      : data['Staff'] ? Object.keys(data['Staff']).filter((id)=> data['Staff'][id].position===servicename)
                                      .map((id)=>data['Staff'][id])
                                      : null
    // dataShown= dataShown !== null && Object.keys(dataShown)
    // console.log(dataShown)
  }

    const user = users[authedUser]
    const answeredQ = Object.keys(categories.services)
    const unansweredQ = Object.keys(categories.staff)
    console.log(unansweredQ);
    // const unansweredQ = Object.keys(questions).filter((question)=> !(question in user.answers))
    return{
        answeredQ: answeredQ,
            // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp),
        unansweredQ: unansweredQ,
        currentTable: type==='Services' ? servicename
                                        : 'Staff',
            // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp)
        dataShown: dataShown
    }
}

export default connect(mapStateToProps)(Dashboard)
