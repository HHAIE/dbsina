import React, {Component} from 'react'
import { connect } from 'react-redux'
import { formatQuestion, formatDate } from '../utils/helpers'
import { handleGetData, handleRemoveData } from '../actions/data'
// import {TiArrowBackOutline} from 'react-icons/ti'
// import {TiHeartOutline} from 'react-icons/ti'
// import {TiHeartFullOutline} from 'react-icons/ti'
// import { handleToggleQuestion } from '../actions/questions'
import { Link, withRouter, Redirect } from 'react-router-dom'
import {truncateText} from '../utils/helpers'

class Question extends Component{
    // handleLike=(e)=>{
    //     e.preventDefault()

    //     // todo: Handle like question
    //     const {dispatch, question, authedUser}= this.props

    //     dispatch(handleToggleQuestion({
    //         id:question.id,
    //         hasLiked:question.hasLiked,
    //         authedUser
    //     }))
    // }

    // toParent = (e, id) =>{
    //     e.preventDefault()
    //     // todo: Redirect to parent question
    //     this.props.history.push(`/question/${id}`)
    // }

    state={
      redirect: false,
      redirectRemove: false,
      redirectAdd: false
    }
    handleAddLink = () => {
      // const {service, type} = this.props;

      this.setState(()=>{
        return{
          redirectAdd: true
        }
      })
    }
    handleLink = (table, category) => {
      const {dispatch, service, type} = this.props;

      dispatch(handleGetData(table, category))
      .then(()=>{
        this.setState(()=>{
          return{
            redirect: true,
          }
      })
      })
    }


    handleRemoveLink = (table, rowId, category) => {
      const {dispatch, service, type} = this.props;
      console.log(table)
      dispatch(handleRemoveData(table, rowId, category))
      .then(()=>{
        this.setState(()=>{
          return{
            redirectRemove: true,
          }
      })
      })
    }

    render(){
        const {category, service, type, servicename}= this.props
        const {redirect, redirectAdd, redirectRemove}= this.state;
        if(service === null){
            return <p>This Question doesn't exist</p>
        }
        else if(redirectAdd){
          return <Redirect to={type==='Services' ? `/add/Services/${service.name}`
          : `/add/Staff/${service.name}`}/>
        }
        else if(redirectRemove){
          return <Redirect to={`/view/${type}/${servicename}`}/>
        }
        else if(redirect){
          return <Redirect to={`/view/${type}/${service.name}`}/>
        }


        // const {timestamp, optionOne, id} = question
        // const {name, avatarURL} = author
        else{
        return(

          <div className='wrap' onClick={(()=>this.handleLink(service.name))}>
            {/* <Link onClick={type==='Services' ?(()=>this.handleLink(service.name))
                                            : (()=>this.handleLink("Staff", service.name))}
                  to={service !== null && `/${type}/${service.name}`} > */}
              <div className='card'>
                <div className='card-liner'>
                  <figure>
                    <img src={service && service.image !== null && ('image' in service) && ('data:image/png;base64,'+ Buffer.from(service.image).toString('base64'))}/>
                    {console.log(service && service)}

                  </figure>
                  {!category && <div className='card--social'>
                    <ul>
                      <li className='instagram'>
                        <a href='#' className='insta'>
                          <i className='bi bi-instagram'></i>
                        </a>
                      </li>
                      <li className='codepen'>
                        <a href='#'>
                          <i className='fab fa-codepen'></i>
                        </a>
                      </li>
                    </ul>
                  </div>}
                  <div className='card--title'>
                    <h3>{service && service.name}</h3>
                    <p>{category && type}</p>
                  </div>
                  <div className='card--desc'>
                    <hr />
                    <p>
                      {service && service.description}
                    </p>
                  </div>
                  <div className='card--btn'>
                    <a href='#'>
                      <span className='moreInfo'>
                        <i className='fa fa-info-circle'></i>
                        CSS HOVER CARD
                      </span>
                      <span className='fullProf'>
                        Don't Forget to like
                        <i className='fa fa-heart'></i>
                      </span>
                    </a>
                  </div>
                  {!category && <button className="btn btn-danger deleteBtn" onClick={(()=>this.handleRemoveLink(servicename, service.id))}>Delete</button>}
                  {category && <button className="btn btn-success addBtn" onClick={(this.handleAddLink)}>Add</button>}
                </div>
              </div>
            {/* </Link> */}
          </div>
            // <div className='question'>
            //     <Link to={`/questions/${id}`}>
            //     <div className='question-head'>
            //         <span>{name} asks:</span>
            //         <div className='time'>{formatDate(timestamp)}</div>
            //     </div>
            //     <div className='question-body'>
            //     <img
            //         src={avatarURL}
            //         alt={`Avatar of ${name}`}
            //         className='avatar'
            //     />
            //     <div className='question-info'>
            //             <span>Would you rather:</span>
            //             <div>{truncateText(optionOne.text)}</div>

            //     </div>
            //     </div>
            // </Link>
            // </div>
        )
    }
  }
}

function mapStateToProps({authedUser, users, questions, categories, data}, props){
  const {id} = props
  const {servicename} = props.match ? props.match.params
                                    : undefined
  const type= servicename ? props.match.params.type
                          : props.type
    // const question = questions[id]
    let service;
    if(servicename){
      service = (data[servicename] && data[servicename][id]) ? (data[servicename] && data[servicename][id])
                                  :{}
    }else{
      service = type==='Services' ? categories.services[id]
                                      : categories.staff[id]
    }
    // const author = question ? users[question.author] : null

    return{
        authedUser,
        // question: question ? question : null,
        // author,
        service,
        servicename: servicename && servicename,
        type: type
    }
}

export default connect(mapStateToProps)(Question)
