import React, {Component} from 'react';
import ReactTable from "react-table";
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'

class TableView extends Component {
  state = {
      data: [],
      columns: []
  }

  componentDidMount(){
    const {dataS, tableColumns} = this.props
    let columns =tableColumns.filter((column)=> column !== 'image')
    this.setState(()=>{
      return {
        data: Object.keys(dataS).filter((key)=> key!=='image').map((keyF)=>dataS[keyF]),
        columns: columns
    }})
  }
  render() {
    const { data, columns } = this.state;
    return (
        <ReactTable
          data={data}
          columns={[
            {
              Header: "Classic View",
              columns:columns.map((column)=>(
                  {
                    id: column,
                    Header: column,
                    accessor: column
                  }
                ))
            }
          ]}
          defaultSorted={[
            {
              id: "name",
              desc: false
            }
          ]}
          filterable={true}
          defaultFiltered={[
            {
              "id": "name",
              "value": ""
            }]}
          onFilteredChange={filtered => this.setState({ filtered })}
          defaultPageSize={20}
          className="-striped -highlight"
        />
    );
  }
}

function mapStateToProps({}, props){
  const {dataS, tableColumns} = props
    return{
      dataS, 
      tableColumns
    }
}

export default withRouter(connect(mapStateToProps)(TableView))

