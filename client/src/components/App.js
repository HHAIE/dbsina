import React, { Component, Fragment } from 'react'
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { handleInitialData } from '../actions/shared'
import Dashboard from './Dashboard'
import  LoadingBar  from 'react-redux-loading'
import NewData from './NewData'
import Leaderboard from './Leaderboard'
import SignIn from './SignIn'
import Nav from './Nav'

class App extends Component {
  componentDidMount(){
    this.props.dispatch(handleInitialData())
  }
  render() {
    return (
      <Router>
        <Switch>
        <div className='container'>
          <LoadingBar/>
          {this.props.loading === true
            ? <SignIn/>
            :<div>
              <Nav/>
              <Route path='/' exact component={Dashboard}/>
              <Route path='/add/:typeAdd/:servicenameAdd' component={NewData}/>
              <Route path='/view/:type/:servicename' component={Dashboard}/>
              <Route path='/leaderboard' component={Leaderboard}/>
              {/* <Route path='/signin' component={SignIn}/> */}
            </div>}
        </div>
      </Switch>
      </Router>
    )
  }
}

function mapStateToProps({authedUser}){
  return{
    loading: authedUser===null,
    authedUser
  }
}

export default connect(mapStateToProps)(App)
