import React, {Component} from 'react'
import { connect } from 'react-redux'
import { formatQuestion, formatDate } from '../utils/helpers'
import { handleGetData, handleRemoveData } from '../actions/data'
// import {TiArrowBackOutline} from 'react-icons/ti'
// import {TiHeartOutline} from 'react-icons/ti'
// import {TiHeartFullOutline} from 'react-icons/ti'
// import { handleToggleQuestion } from '../actions/questions'
import { Link, withRouter, Redirect } from 'react-router-dom'
import {truncateText, capitalizeFirstLetter} from '../utils/helpers'
import { Button, Confirm } from 'semantic-ui-react'

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
      redirectAdd: false,
      redirectEdit: false,
      open: false
    }
    handleAddLink = () => {
      // const {service, type} = this.props;

      this.setState(()=>{
        return{
          redirectAdd: true
        }
      })
    }

    handleEditLink = () => {
      // const {service, type} = this.props;

      this.setState(()=>{
        return{
          redirectEdit: true
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

    //Functions to enlarge the media when clicked
    modalOpen=(id)=>{
      //Variables for the modal Element
      let modalName = 'myModal'+id;
      let modal = document.getElementById(modalName);
      modal.style.display = "block";
    }
    // When the user clicks on <span> (x), close the modal
     modalClose=(id)=> {
      //Variables for the modal Element
      let modalName = 'myModal'+id;
      let modal = document.getElementById(modalName);

      modal.style.display = "none";
    }

    show = (e) => {
      e.stopPropagation();
      this.setState({ open: true })
    }
    
    handleConfirm = (e, servicename, id) => {
      e.stopPropagation();
      this.handleRemoveLink(servicename, id)
      this.setState({ open: false })
    }
    handleCancel = (e) => {
      e.stopPropagation();
      this.setState({ open: false })
    }

    render(){
        const {category, service, type, servicename}= this.props
        const {redirect, redirectAdd, redirectEdit, redirectRemove, open }= this.state;
        if(service === null){
            return <p>This Question doesn't exist</p>
        }
        else if(redirectAdd){
          return <Redirect to={type==='Services' ? `/new_data/add/Services/${service.name}`
          : `/new_data/add/Staff/${service.name}`}/>
        }
        else if(redirectEdit){
          return <Redirect to={type==='Services' ? `/new_data/edit/Services/${servicename}/${service.id}`
          : `/new_data/edit/Staff/${servicename}/${service.id}`}/>
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

          <div className='wrap' >
            {/* <Link onClick={type==='Services' ?(()=>this.handleLink(service.name))
                                            : (()=>this.handleLink("Staff", service.name))}
                  to={service !== null && `/${type}/${service.name}`} > */}
              <div className='card'onClick={category ?(()=>this.handleLink(service.name)) : (()=>this.modalOpen(service && service.id))}>
                <div className='card-liner'>
                  <figure>
                    <img src={service && service.image !== null && ('image' in service) 
                              && Buffer.from(service.image).toString('base64') !== 'dW5kZWZpbmVk' 
                              ? ('data:image/png;base64,'+ Buffer.from(service.image).toString('base64'))
                              : service.gender === 'Male' ? '/male-avatar.png'
                              :'/female-avatar.png'}/>

                  </figure>
                  {!category && <div className='card--social'>
                    <ul>
                      <li className='instagram'>
                        <a href={`tel:${service && service.phone}`} onClick={((e)=>{e.stopPropagation();})} className='insta'>
                          <i className='fa fa-phone'></i>
                        </a>
                      </li>
                      <li className='codepen'>
                        <a href={`mailto:${service && service.email}`} onClick={((e)=>{e.stopPropagation();})}>
                          <i className='fa fa-envelope-o'></i>
                        </a>
                      </li>
                    </ul>
                  </div>}
                  <div className='card--title'>
                    <h3>{service && service.name} &nbsp;
                      {service && service.gender && <i className={`fa ${service.gender === 'Male' ? 'fa-male' : 'fa-female'}`} aria-hidden="true"></i>}
                    </h3>
                    <p>{category && type}</p>
                  </div>
                  <div className='card--desc'>
                    <hr />
                    <p>
                      {service && service.description}
                    </p>
                  </div>
                  {/* <div className='card--btn'>
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
                  </div> */}
                  {!category && <div><button className="btn btn-primary editBtn" onClick={(this.handleEditLink)}>Edit</button>
                  <button className="btn btn-danger deleteBtn" onClick={((e)=>this.show(e))}>Delete</button>
                  <Confirm
                    open={open}
                    onCancel={((e)=>this.handleCancel(e))}
                    onConfirm={((e)=>this.handleConfirm(e, servicename, service.id))}
                  /></div>}
                  {category && <button className="btn btn-success addBtn" onClick={(this.handleAddLink)}>Add</button>}
                </div>
              </div>
              {!category &&
              <div id={`myModal${service && service.id}`} className="modalO">

                {/* <!-- Modal Content --> */}
                <img className="modal-content" id="img01" src={service && service.image !== null && ('image' in service) 
                              && Buffer.from(service.image).toString('base64') !== 'dW5kZWZpbmVk' 
                              ? ('data:image/png;base64,'+ Buffer.from(service.image).toString('base64'))
                              : service.gender === 'Male' ? '/male-avatar.png'
                              :'/female-avatar.png'}/>
                <ul className="modal-content">
                  {service && Object.keys(service).filter(key=> key !=="id" && key !=="image").map((key)=>
                  <li>{`${capitalizeFirstLetter(key)}: `} <span>{`${service[key]}`}</span></li>)}
                  {!category && <div className='modal-btn'><button className="btn btn-primary editBtn" onClick={(this.handleEditLink)}>Edit</button>
                  <button className="btn btn-danger deleteBtn" onClick={((e)=>this.show(e))}>Delete</button>
                  <Confirm
                    open={open}
                    onCancel={((e)=>this.handleCancel(e))}
                    onConfirm={((e)=>this.handleConfirm(e, servicename, service.id))}
                  /></div>}
                </ul>
                
                {/* <iframe class="modal-content" id="vid01" width="100%" height="75%" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
    
                {/* <!-- The Close Button of the Modal --> */}
                <span onClick={(()=>this.modalClose(service && service.id))} className="close">&times;</span>
              </div>}
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
  const servicename = props.match ? props.match.params.servicename
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

export default withRouter(connect(mapStateToProps)(Question))
