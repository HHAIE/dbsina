import React, {Component} from 'react'
import { connect } from 'react-redux'
import { formatQuestion, formatDate } from '../utils/helpers'
import { Link, withRouter } from 'react-router-dom'
import {truncateText} from '../utils/helpers'

class User extends Component{
    render(){
        const {user, totalQs}= this.props
        if(user === null){
            return <p>This User doesn't exist</p>
        }

        const {name, avatarURL, answers, questions} = user
        const score = Math.floor((Object.keys(answers).length+questions.length)/(2*totalQs) *100)/10
        return(
            <div className='question'>
                <div className='question-body'>
                <img
                    src={avatarURL}
                    alt={`Avatar of ${name}`}
                    className='avatar'
                />
                <div className='user-info'>
                        <span>{name}</span>
                        <div>Answered Questions: 
                            <span>{Object.keys(answers).length}</span>
                        </div>                       
                        <div>Created Questions: 
                            <span>{questions.length}</span>
                        </div>
                </div>
                <div className='score'>
                    <div>Score</div>
                    <div>{score}<br/>/10</div>
                </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps({authedUser, users, questions}, {id}){
    const user = users[id]
    const totalQs= Object.keys(questions).length

    return{
        user,
        totalQs,
    }
}

export default withRouter(connect(mapStateToProps)(User))