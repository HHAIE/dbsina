import React, {Component} from 'react'
import {connect} from 'react-redux'
import { setAuthedUser } from '../actions/authedUser'
import { Redirect } from 'react-router-dom'
import {app} from '../utils/fbLogin'
import FacebookLogin from "react-facebook-login";


class SignIn extends Component{
    state={
        // selectedUser:null,
        btnDisabled: true,
        toHome: false,
        isLoggedIn: false,
        userID: "",
        name: "",
        email: "",
        picture: ""
    }
    componentDidMount(){
      const {dispatch, selectedUser}= this.props
      console.log(selectedUser)
      if(selectedUser){
        dispatch(setAuthedUser(selectedUser.id))
      }
    }
    componentDidUpdate(){
      const {dispatch, selectedUser}= this.props
      console.log(selectedUser)
      if(selectedUser){
        dispatch(setAuthedUser(selectedUser.id))
      }
    }

    responseFacebook = response => {
        console.log(response);
        
        this.setState(()=>{
            return{
                toHome: true,
            }
        })

        // this.setState({
        //   isLoggedIn: true,
        //   userID: response.userID,
        //   name: response.name,
        //   email: response.email,
        //   picture: response.picture.data.url
        // });
      };

      componentClicked = () => {
        const {dispatch}= this.props
    //    setTimeout(ipcRenderer.send("fb-authenticate", "yes"), 1000)
    //    .then(()=>{
    //     this.setState(()=>{
    //         return{
    //             toHome: true,
    //         }
    //     })
    //    })
          // .then((res)=>{console.log(res)})
          dispatch(setAuthedUser("2378412595629472"))
        this.setState(()=>{
          return{
              toHome: true,
          }
      })

        }

    handleChange=(e)=>{
        this.setState(()=>{
            return{
                selectedUser: e.target.value,
                btnDisabled: false,
            }
        })
    }
    handleSubmit=(e)=>{
        e.preventDefault()
        const {dispatch}= this.props
        const {selectedUser} = this.state

        dispatch(setAuthedUser(selectedUser.id))
        this.setState(()=>{
            return{
                toHome: true,
            }
        })
    }
    // signIn = () =>{
    //   const auth = getAuth();
    //   const provider = new FacebookAuthProvider();
    //   console.log(auth)
    //   signInWithRedirect(auth)
    //     .then((result) => {
          // The signed-in user info.
        //   const user = result.user;

          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //   const credential = FacebookAuthProvider.credentialFromResult(result);
        //   const accessToken = credential.accessToken;
        //   console.log(user)

          // ...
        // })
        // .catch((error) => {
          // Handle Errors here.
        //   const errorCode = error.code;
        //   const errorMessage = error.message;
          // The email of the user's account used.
        //   const email = error.email;
          // The AuthCredential type that was used.
        //   const credential = FacebookAuthProvider.credentialFromError(error);

          // ...
        // });
    // }
    render(){
        const {users}=this.props
        const{btnDisabled, toHome}=this.state
        if(toHome){
            return <Redirect to='/'/>
        }
        return(
            <div className='signInBox'>
                {/* {selectedUser!==null &&
                (
                    <div className=''>
                        <img
                        src={users[selectedUser].avatarURL}
                        alt={`Avatar of ${users[selectedUser].name}`}
                        className='avatar'
                        />
                        <div>
                            {users[selectedUser].name}
                        </div>
                    </div>
                )}
                <form className='new-answer' onSubmit={this.signIn}
                // onChange={this.handleChange}
                >
                    <select name="users" className='usersMenu' defaultValue=''>
                    <option value="" disabled>Select user</option>
                        {Object.keys(users).map((id)=>(
                            <option key={id} value={id}>{users[id].name}</option>
                        ))}
                    </select>
                    <button
                        type='submit'
                        // disabled={selectedUser===null}
                        onClick={this.signIn}>
                            Sign In
                    </button>
                </form> */}
                <button className="fb connect" onClick={this.componentClicked}>Sign in with Facebook</button>
                
                




                {/* main code to implement */}
                {/* <FacebookLogin
                appId="1335047956992839"
                autoLoad={true}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}
                /> */}
            </div>
        )
    }
}

function mapStateToProps({users}){
  let selectedUser;
  for (let user in users){
    if(users[user].authed==1){
      selectedUser = users[user]
    }
  }
    return{
        selectedUser,
    }
}

export default connect(mapStateToProps)(SignIn)
