import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { handleGetTableC, languagesOptions, handleAddData } from '../actions/data'
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import PhoneInput, {isValidPhoneNumber} from 'react-phone-number-input'
import ReactStars from "react-rating-stars-component";
// import { type } from 'process'


class NewData extends Component{
    state={
        type:'',
        servicename:'',
        columns:[],
        phoneNum: '',
        rating: 2.5,
        staffColumn:[],
        servicesColumn:[],
        redir: false

        // btnDisabled: true,
        // optionTwoDisabled: true,
        // toHome: false
    }
    componentDidMount(){
      let {type, servicename, services, staff}= this.props
      console.log(services)
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

      if(type==='Services'){
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
      }else if(type==='Staff'){
        return handleGetTableC('Staff')
        .then((data)=>{
          this.setState(()=>({
            type: type,
            servicename: servicename,
            staffColumn: staff,
            servicesColumn: services,
            columns: data
          }))
        })
      }
    }

    componentDidUpdate(){
      const {type, servicename, phoneNum, redir}= this.state
      if(!redir){
        let inputs = document.getElementsByTagName('input')
        console.log(inputs)
        for(let elem of inputs){
          if(!elem.classList.contains('form-control')){
            elem.classList.add('form-control')
        }
      }

        let mySelect = document.getElementById('FormControlSelect1');

        for(let i, j = 0; i = mySelect.options[j]; j++) {
            if(i.value == type) {
                mySelect.selectedIndex = j;
                break;
            }
        }

        mySelect = document.getElementById('FormControlSelect2');

        if(mySelect!==null){
          for(let i, j = 0; i = mySelect.options[j]; j++) {
            if(i.value == servicename) {
                mySelect.selectedIndex = j;
                break;
            }
          }
        }

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
          handleGetTableC('Staff')
          .then((data)=>{
            this.setState(()=>({
              columns: data,
              type: type,
              servicename:'Tour-Guide'
            }))
          })
        }
    }
    handleServiceChange=(e)=>{
      const servicename = e.target.value
      const {type}= this.state

      if(type==='Services'){
        handleGetTableC(servicename)
        .then((data)=>{
          this.setState(()=>({
            columns: data,
            servicename: servicename
          }))
        })
      }else if(type==='Staff'){
        handleGetTableC('Staff')
        .then((data)=>{
          this.setState(()=>({
            columns: data,
            servicename: servicename
          }))
        })
      }
  }

    handleSubmit=(e)=>{
      const {columns, type, servicename} = this.state
      const {dispatch} = this.props

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
            // fs.readFileSync(e.target.elements[column].files[0].path)
            :e.target.elements[column].value!=='' && e.target.elements[column].value
            data.append(column, val)
          }
        })
        console.log(data)
        console.log(...data.values())
        console.log(...data.keys())
        console.log(data['name'])

        dispatch(handleAddData((type === 'Services'? servicename :type), data, servicename))
        .then(()=>{
          this.setState(()=>{
            return{
              redir: true,
            }
        })
        })

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

    render(){
        const {type, servicename, columns, phoneNum, rating, servicesColumn, staffColumn, redir}= this.state
        // const {}= this.props

        console.log(servicesColumn)
        console.log(staffColumn)
        if(redir){
          return <Redirect to={`/view/${type}/${servicename}/`}/>
        }

        return(
            <div>
                <h3 className='center'>Add New Entity</h3>
                <form className="new-question needs-validation" onSubmit={(e)=>this.handleSubmit(e)} noValidate>
                  <div className="form-group">
                    <label htmlFor="FormControlSelect1">Category</label>
                    <select className="form-control" id="FormControlSelect1" name='table' onChange={(e)=>this.handleTypeChange(e)}>
                    <option value='Services'>Services</option>
                    <option value='Staff'>Staff</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="FormControlSelect2"> Subcategory </label>
                    {type==='Staff' &&<select className="form-control" id="FormControlSelect2" onChange={(e)=>this.handleServiceChange(e)}>
                      {staffColumn.map((s)=>
                        <option key={s} value={s}>{`${s}`}</option>
                      )}
                      {/* <option value='Tour-Guide'>Tour-Guide</option> */}
                    </select>}
                    {type==='Services' &&<select className="form-control" id="FormControlSelect2" onChange={(e)=>this.handleServiceChange(e)}>
                    {servicesColumn.map((s)=>
                        <option key={s} value={s}>{`${s}`}</option>
                      )}
                      {/* <option value='Hotels'>Hotels</option>
                      <option value='Boats'>Boats</option>
                      <option value='Restaurants'>Restaurants</option>
                      <option value='Transport'>Transport</option> */}
                    </select>}
                  </div>

                  {columns.map((column)=>
                    column === 'image' ?<div key={column} className="form-group custom-file">
                      <input type="file" className="custom-file-input" name={column} id="customFile"/>
                      <label className="custom-file-label" htmlFor="customFile">Choose file</label>
                    </div>
                  : column === 'id' ? <br/>
                  : (column === 'age'|| column.includes('price')) ? <div key={column} className="form-group row">
                      <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                      <div className="col-sm-10">
                        <input type="number" min="18" max="10000" step="1" className="form-control" name={column} id={`colFormLabel${column}`} required/>                      </div>
                    </div>
                  : column === 'Languages'? <div key={column} className="form-group row">
                          <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                          <div className="col-sm-10">
                          <Select
                            closeMenuOnSelect={false}
                            components={makeAnimated()}
                            isMulti
                            options={languagesOptions}
                            className="form-control" name={column} id={`colFormLabel${column}`} required
                          />
                          </div>
                        </div>
                  : column === 'email'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                      <input type="email" className="form-control" name={column} id={`colFormLabel${column}`} required/>
                    </div>
                  </div>
                  : column === 'position'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                    <select className="form-control" name={column} id={`colFormLabel${column}`} >
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
                  <ReactStars {...{size: 30,
                      count: 5,
                      value: rating,
                      isHalf: true,
                      onChange: (e)=> this.updateRating(e)
                      }}/>
                    <input type="number" className="form-control" name={column} id={`colFormLabel${column}`} value={rating} style={{display:'none'}}/>
                  </div>
                </div>
                :column === 'phone'? <div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                    <PhoneInput
                      international
                      defaultCountry="EG"
                      value={phoneNum}
                      onChange={(e)=> this.updatePhoneNum(e)}
                      className="form-control" name={column} id={`colFormLabel${column}`} required/>
                      {/* <input type="tel" className="form-control" name={column} id={`colFormLabel${column}`} required/> */}
                    </div>
                  </div>
                  :<div key={column} className="form-group row">
                    <label htmlFor={`colFormLabel${column}`} className="col-sm-2 col-form-label">{column}</label>
                    <div className="col-sm-10">
                      <input type="text" className="form-control" name={column} id={`colFormLabel${column}`} required/>
                    </div>
                  </div>
                  )}

                  <button className="btn btn-primary submitBtn" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}


function mapStateToProps({categories}, props){
  let {typeAdd, servicenameAdd} = props.match.params
  const {dispatch}= props
  let columns=[];
  if(typeAdd){
    let column= async () => typeAdd === 'Services' ? await handleGetTableC(servicenameAdd)
                                                : await handleGetTableC('Staff')
    columns = column()
  }else{
    typeAdd = ''
  }


  let services = Object.keys(categories.services).map((key)=> categories.services[key].name)
  let staff = Object.keys(categories.staff).map((key)=> categories.staff[key].name)
  console.log(services)
  console.log(columns)
    return{
        type: typeAdd,
        servicename: servicenameAdd,
        services:services,
        staff:staff,
        dispatch: dispatch
    }
}

export default withRouter(connect(mapStateToProps)(NewData))
