import React, {Component} from 'react'
import { connect } from 'react-redux'
import Question from './Question'
import { BrowserRouter as Router, Route } from 'react-router-dom'


class Dashboard extends Component{
    state={
        answered: false,
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
        const {answeredQ, unansweredQ}=this.props
        return(
            <div className='dashboard'>
                <div className='questions'>
                {answered
                ? answeredQ.map((q)=>(<Question key={q} id={q} category={false} type={"services"}/>))
                : unansweredQ.map((q)=>(<Question key={q} id={q} category={false} type={"staff"}/>))}
                </div>
            </div>
        )
    }
}

function mapStateToProps({questions, users, authedUser, services, staff}){
    const user = users[authedUser]
    const answeredQ = Object.keys(services)
    const unansweredQ = Object.keys(staff)
    console.log(unansweredQ);
    // const unansweredQ = Object.keys(questions).filter((question)=> !(question in user.answers))
    return{
        answeredQ: answeredQ,
            // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp),
        unansweredQ: unansweredQ
            // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp)
    }
}

export default connect(mapStateToProps)(Dashboard)
