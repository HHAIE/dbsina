import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { handleGetTableC, languagesOptions, handleAddData, handleUpdateData } from '../actions/data'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input'
import ReactStars from "react-rating-stars-component";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import CurrentLocation from './CurrentLocation';
import MyGoogleMap from './MyGoogleMap';

const mapStyles = {
  position: 'relative',
  width: '90%',
  height: '100%',
  margin: 'auto',
  'border-radius': '10px'
};
// import { type } from 'process'


class NewData extends Component{
  constructor(props) {
    super(props);
    this.maps1 = React.createRef();
  }
    state={
        type:'',
        servicename:'',
        columns:[],
        phoneNum: '',
        rating: 2.5,
        staffColumn:[],
        servicesColumn:[],
        redir: false,
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
    }

    componentDidMount(){
      let {action, type, servicename, services, service, staff}= this.props
      console.log(Object.keys(service))
      console.log(staff)
      var forms = document.getElementsByClassName('needs-validation');
      // Loop over them and prevent submission
      Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          form.classList.add('was-validated');
        }, false);
      });

      if (action==="edit"){
        return this.setState(()=>({
          type: type,
          servicename: servicename,
          staffColumn: staff,
          servicesColumn: services,
          columns: Object.keys(service)
        }))
      }

        return handleGetTableC(servicename)
        .then((data)=>{
          console.log(data)
          this.setState(()=>({
            type: type,
            servicename: servicename,
            staffColumn: staff,
            servicesColumn: services,
            columns: data
          }))
        })
    }

    componentDidUpdate(){
      const {action, type, servicename, phoneNum, redir}= this.state
      if(!redir){
        let inputs = document.getElementsByTagName('input')
        console.log(inputs)
        for(let elem of inputs){
          if(!elem.classList.contains('form-control')){
            elem.classList.add('form-control')
        }
      }

      // if (action==="add"){
      //   let mySelect = document.getElementById('FormControlSelect1');

      //   for(let i, j = 0; i = mySelect.options[j]; j++) {
      //       if(i.value == type) {
      //           mySelect.selectedIndex = j;
      //           break;
      //       }
      //   }

      //   mySelect = document.getElementById('FormControlSelect2');

      //   if(mySelect!==null){
      //     for(let i, j = 0; i = mySelect.options[j]; j++) {
      //       if(i.value == servicename) {
      //           mySelect.selectedIndex = j;
      //           break;
      //       }
      //     }
      //   }
      // }
      }
    }

    handleTypeChange=(e)=>{
        const type = e.target.value

        if(type==='Services'){
          handleGetTableC('Hotels')
          .then((data)=>{
            this.setState(()=>({
              columns: data,
              type: type,
              servicename:'Hotels'
            }))
          })
        }else if(type==='Staff'){
          handleGetTableC('Guides')
          .then((data)=>{
            this.setState(()=>({
              columns: data,
              type: type,
              servicename:'Guides'
            }))
          })
        }
    }

    handleServiceChange=(e)=>{
      const servicename = e.target.value
      const {type}= this.state

        handleGetTableC(servicename)
        .then((data)=>{
          this.setState(()=>({
            columns: data,
            servicename: servicename
          }))
        })
    }

    handleMapChange=(e)=>{
      console.log("Hi")
      console.log(this.maps1 && this.maps1.current.state.lat)
    }

    handleSubmit=(e)=>{
      const {columns, type, servicename} = this.state
      const {dispatch, action, rowId} = this.props

      let mapState = this.maps1.current && this.maps1.current.state
      console.log(`${mapState.lat},${mapState.lng}`)

        e.preventDefault()
        let joinArray = (arr) => {
          let output = ''
          arr.forEach((str)=>{
            output+=str.value+', '
          })
          return output
        }
        // console.log(joinArray(e.target.elements['Languages']))
        let data = new FormData()
        columns.forEach((column)=>{
          if(e.target.elements[column]){
            let val = column === 'Languages' ? joinArray(e.target.elements[column])
            : column === 'image' ? e.target.elements[column].files[0] && e.target.elements[column].files[0]
            : column === 'location' ? `${mapState.lat},${mapState.lng}`
            // fs.readFileSync(e.target.elements[column].files[0].path)
            :e.target.elements[column].value!=='' && e.target.elements[column].value
            data.append(column, val)
          }
        })

        if (action==="add"){
          dispatch(handleAddData(servicename, data))
          .then(()=>{
            this.setState(()=>{
              return{
                redir: true,
              }
          })
          })
        } else if (action==="edit"){
          console.log(data)
          dispatch(handleUpdateData(servicename, data, rowId))
          .then(()=>{
            this.setState(()=>{
              return{
                redir: true,
              }
          })
          })
        }
        

        // const {optionOne, optionTwo, toHome}= this.state
        // const {dispatch} = this.props

        // dispatch(handleAddQuestion(optionOne, optionTwo))
        // this.setState(()=>({
        //     optionOne,
        //     optionTwo,
        //     toHome: true,
        // }))
    }

    updateRating(e){
      this.setState(()=>({
        rating: e ? e
                    : ''
      }))
    }

    updatePhoneNum(e){
      if(e){
        let elem = document.querySelector('input[type="tel"]')
        let classValid1 = 'is-valid'
        let classValid2 = 'form-control:valid'
        let classInValid1 = 'is-invalid'
        let classInValid2 = 'form-control:invalid'
        let classes1 = isValidPhoneNumber(e)?classValid1:classInValid1
        let classes2 = isValidPhoneNumber(e)?classValid2:classInValid2
        elem.classList.remove(classValid1)
        elem.classList.remove(classValid2)
        elem.classList.remove(classInValid1)
        elem.classList.remove(classInValid2)
        elem.classList.add(classes1, classes2)
      }


      this.setState(()=>({
        phoneNum: e ? e
                    : ''
      }))
    }

    onMarkerClick = (props, marker, e) =>
    {console.log(e.latLng.lat())
      this.setState({
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      });}

    onClose = props => {
      if (this.state.showingInfoWindow) {
        this.setState({
          showingInfoWindow: false,
          activeMarker: null
        });
      }
    };

    render(){
        const {type, servicename, columns, servicesColumn, staffColumn, redir}= this.state
        const {action, service}= this.props
        let {phoneNum, rating}= this.state
        // const {}= this.props

        if(redir){
          return <Redirect to={`/view/${type}/${servicename}/`}/>
        }

        return(
            <div>
                <h3 className='center'>Add New Entity</h3>
                <form className="new-question needs-validation" onSubmit={(e)=>this.handleSubmit(e)} noValidate>
                  {action==="add" && <div className="form-group row">
                    <label htmlFor="FormControlSelect1">Category</label>
                    <div className="col-sm-10">
                      <select className="form-control" id="FormControlSelect1" onChange={(e)=>this.handleTypeChange(e)} value={`${type}`}>
                        <option value='Services'>{`Services`}</option>
                        <option value='Staff'>{`Staff`}</option>
                      </select>
                    </div>
                  </div>}
                  {action==="add" && <div className="form-group row">
                    <label htmlFor="FormControlSelect2"> Subcategory </label>
                    <div className="col-sm-10">
                    {type==='Staff' &&<select className="form-control" id="FormControlSelect2" onChange={(e)=>this.handleServiceChange(e)} defaultValue={servicename}>
                      {staffColumn.map((s)=>
                        <option key={s} value={s}>{`${s}`}</option>
                      )}
                      {/* <option value='Tour-Guide'>Tour-Guide</option> */}
                    </select>}
                    {type==='Services' &&<select className="form-control" id="FormControlSelect2" onChange={(e)=>this.handleServiceChange(e)} defaultValue={servicename}>
                    {servicesColumn.map((s)=>
                        <option key={s} value={s}>{`${s}`}</option>
                      )}
                      {/* <option value='Hotels'>Hotels</option>
                      <option value='Boats'>Boats</option>
                      <option value='Restaurants'>Restaurants</option>
                      <option value='Transport'>Transport</option> */}
                    </select>}
                    </div>
                  </div>}

                  {columns.map((column)=>
                    column === 'licence'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                      <div className="col-sm-10">
                      <select className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required>
                        <option value='eco'>eco</option>
                        <option value='normal'>normal</option>
                        </select>
                      </div>
                    </div>
                    :column === 'status'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                      <div className="col-sm-10">
                      <select className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required>
                        <option value='Trainee'>Trainee</option>
                        <option value='Fully trained'>Fully trained</option>
                        <option value='Experienced'>Experienced</option>
                        </select>
                      </div>
                    </div>
                    :(column.toLowerCase() === 'languages' || column.toLowerCase() === 'language')&& <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                    <Select
                      value={action==="edit" && service[column].split(",").map((lang)=> {return {value:lang, label:lang}})}
                      closeMenuOnSelect={false}
                      components={makeAnimated()}
                      isMulti
                      options={languagesOptions}
                      className="form-control" name={column} id={`colFormLabel${column}`} required
                    />
                    </div>
                  </div>)}

                  {/* Contact Details Section for the staff */}
                  {columns.includes('phone')&&
                  <div key='contact' className='form-group row'>
                    <br/>
                    <h2>Contact Details</h2>
                    {columns.map((column)=>
                    column === 'gender'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                      <div className="col-sm-10">
                      <select className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                        </select>
                      </div>
                    </div>
                    : column === 'name'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required/>
                    </div>
                  </div>
                  :column === 'phone'? <div key={column} className="form-group row">
                  <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                      {action==="edit" ? phoneNum=service[column]: phoneNum=phoneNum}
                    <PhoneInput
                      international
                      defaultCountry="EG"
                      value={phoneNum}
                      onChange={(e)=> this.updatePhoneNum(e)}
                      className="form-control" name={column} id={`colFormLabel${column}`} required/>
                    </div>
                  </div>
                  : column === 'email'&& <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                      <input type="email" className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required/>
                    </div>
                  </div>)}
                  </div>}
                  {columns.includes('street')&&
                  <div key='address' className='form-group row'>
                    <br/>
                    <h3>Address Details</h3>
                    {columns.map((column)=>
                    (column === 'governorate' || column === 'city' || column === 'street' || column === 'building')
                    ?<div key={column} className="form-group row">
                       <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                       <div className="col-sm-10">
                         <input type="text" className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required/>
                       </div>
                     </div>
                     : column === 'location' && 
                     <div key={column} className="form-group row" style={{height: "70vh"}}>
                      <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                       {/* <Map
                        google={this.props.google}
                        zoom={14}
                        className="map"
                        style={mapStyles}
                        initialCenter={
                          {
                            lat: -1.2884,
                            lng: 36.8233
                          }
                        }
                        onClick={(e)=>this.handleMapChange(e)}
                      > */}
                      {/* <CurrentLocation
                        centerAroundCurrentLocation
                        onClick={(e)=>this.handleMapChange(e)}
                        google={this.props.google}
                      >
                      <Marker
                          onClick={this.onMarkerClick}
                          name={'Current Location'}
                        />
                        <InfoWindow
                          marker={this.state.activeMarker}
                          visible={this.state.showingInfoWindow}
                          onClose={this.onClose}
                        >
                          <div>
                            <h4>{this.state.selectedPlace.name}</h4>
                          </div>
                        </InfoWindow>
                        </CurrentLocation> */}
                      {/* </Map> */}
                      <div className="main-wrapper" onClick={(e)=>this.handleMapChange(e)}>
                        <MyGoogleMap ref={this.maps1} loc={action==="edit" && service[column]} />
                      </div>
                       <div className="col-sm-10" style={{display: "none"}}>
                         <input type="text" className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required/>
                       </div>
                     </div>)}
                    </div>}
                  

                  {columns.map((column)=>
                    column === 'image' ?<div key={column} className="form-group custom-file row">
                      <div className="col-sm-10">
                      <input type="file" className="custom-file-input" name={column} id="customFile"/>
                      </div>
                      {/* <label className="custom-file-label" htmlFor="customFile">Choose file</label> */}
                    </div>
                  : column === 'id' ? <br/>
                  : (column === 'age'|| column.includes('price')) ? <div key={column} className="form-group row">
                      <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                      <div className="col-sm-10">
                        <input type="number" min="18" max="10000" step="1" className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required/>                      </div>
                    </div>
                  
                  : column === 'position'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                    <select className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]}>
                      {staffColumn.map((s)=>
                        <option key={s} value={s}>{`${s}`}</option>
                      )}
                    </select>
                      {/* <input type="email" className="form-control" name={column} id={`colFormLabel${column}`} required/> */}
                    </div>
                  </div>
                :column.toLowerCase().includes('rating')? <div key={column} className="form-group row">
                  <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                  <div className="col-sm-10">
                  {action==="edit" ? rating=service[column]: rating=rating}
                  <ReactStars {...{size: 30,
                      count: 5,
                      value: rating,
                      isHalf: true,
                      onChange: (e)=> this.updateRating(e)
                      }}/>
                    <input type="number" className="form-control" name={column} id={`colFormLabel${column}`} value={rating} style={{display:'none'}}/>
                  </div>
                </div>
                  :column === 'vaccinated'? <div key={column} className="form-group row">
                  <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                    <select className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required>
                      <option value='Yes'>Yes</option>
                      <option value='No'>No</option>
                      </select>
                    </div>
                  </div>
                  :(column !== 'gender' && column !== 'name' && column !== 'phone' && column !== 'email' && 
                  column !== 'governorate' && column !== 'city' && column !== 'street' && column !== 'building'
                  && column !== 'licence' && column !== 'status' && column !== 'language' && column !== 'location')
                  && <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" name={column} id={`colFormLabel${column}`} defaultValue={action==="edit" && service[column]} required/>
                    </div>
                  </div>
                  )}

                  <button className="btn btn-primary submitBtn" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}


function mapStateToProps({categories, data}, props){
  let {action, typeAdd, servicenameAdd} = props.match.params
  let {rowId} = action === "edit" && props.match.params
  const {dispatch, google}= props
  let services, staff;
  // let columns=[];
  // if(typeAdd){
  //   let column= async () => await handleGetTableC(servicenameAdd)

  //   columns = column()
  // }else{
  //   typeAdd = ''
  // }

  let service;
  if(action ==="edit"){
    service = Object.values(data[servicenameAdd]).filter((serv)=> serv['id']==rowId)
    service = service[0]
    console.log(service['vaccinated'])
  }

  if (action ==="add"){
    services = Object.keys(categories.services).map((key)=> categories.services[key].name)
    staff = Object.keys(categories.staff).map((key)=> categories.staff[key].name)
  }
  return{
      type: typeAdd,
      servicename: servicenameAdd,
      action: action,
      service:action ==="edit" && service,
      rowId:action ==="edit" && rowId,
      services:action ==="add" && services,
      staff:action ==="add" && staff,
      dispatch: dispatch,
      google: google
  }
}

// export default connect(mapStateToProps)(GoogleApiWrapper({
//   apiKey: 'AIzaSyCarqroh-Pd_ovPqPGx7EzFILgWi2YJvMs'
// })(NewData))

export default connect(mapStateToProps)(NewData)
