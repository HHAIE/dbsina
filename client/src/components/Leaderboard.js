import { func } from 'assert-plus'
import { div } from 'prelude-ls'
import React, {Component} from 'react'
import { connect } from 'react-redux'
import User from './User'
import { BrowserRouter as Router, Route } from 'react-router-dom'


class Leaderboard extends Component{
    state={
        answered: true,
    }

    toggleAnswered=(e, answered)=>{
        this.setState(()=>{
          return{
            answered: answered,
          }  
        })
    }

    render(){
        const {answered} = this.state
        const {users}=this.props
        return(
            <div className='dashboard'>
                
                <div className=''>
                {users.map((u)=>(<User key={u} id={u}/>))}
                </div>
            </div>
        )
    }
}

function mapStateToProps({questions, users, authedUser}){
    const userScore = (key)=>{
       return Object.keys(users[key].answers).length + users[key].questions.length
    }
    return{
        users: Object.keys(users)
        .sort((a,b)=> userScore(b)-userScore(a) )
    }
}
// sdfsd
export default connect(mapStateToProps)(Leaderboard)