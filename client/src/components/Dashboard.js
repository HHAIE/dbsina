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
        tableColumn: [],
        searchInput:''
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
      this.setState(()=>{
        return{
          tableColumn: columns,
          optimizedView: view
        }
      })
    }

    handleSearchChange=(e)=>{
      const searchInput = e.target.value

      this.setState(()=>({
        searchInput: searchInput,
      }))
  }

    render(){
        const {answered, optimizedView, tableColumn, searchInput} = this.state
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
                  {(dataShown!==null)&& 
                    <div key="search-bar" className="form-group row">
                      <div className="col-sm-10">
                        <input type='text' className="form-control" id={`colFormLabelSearchBar`} value={searchInput} placeholder="Search..." onChange={(e)=>this.handleSearchChange(e)}/>
                      </div>
                    </div>}
                  { (dataShown!==null) ? 
                  Object.keys(dataShown).filter((k)=>dataShown[k]['name'].toLowerCase().includes(searchInput.toLowerCase())).map((q)=>(<Question key={q} id={q} category={false}/>))
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
  console.log(servicename)
  let dataShown=null;
  if (type){
    dataShown = data[servicename] ? data[servicename]
                                      : null
    // dataShown= dataShown !== null && Object.keys(dataShown)
    // console.log(dataShown)
  }

    const user = users[authedUser]
    const answeredQ = Object.keys(categories.services)
    const unansweredQ = Object.keys(categories.staff)
    // const unansweredQ = Object.keys(questions).filter((question)=> !(question in user.answers))
    return{
        answeredQ: answeredQ,
            // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp),
        unansweredQ: unansweredQ,
        currentTable: servicename,
            // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp)
        dataShown: dataShown
    }
}

export default connect(mapStateToProps)(Dashboard)
