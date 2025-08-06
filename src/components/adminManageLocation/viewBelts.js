import React, { Component } from "react";

export class ViewBelts extends Component {
  state = {
    assemblyLine: [],
    LocationName: ""
  };
  componentDidMount() {
    if (this.props.dataForEdit != null) {
      let { dataForEdit } = this.props;
      this.setState({
        assemblyLine: dataForEdit.assemblyLine,
        LocationName: dataForEdit.name
      });
    }
  }
  render() {
    let { assemblyLine } = this.state;
    let beltView;
    if (
      assemblyLine.length !== 0 &&
      assemblyLine !== null &&
      assemblyLine !== undefined &&
      Object.keys(assemblyLine).length !== 0
    ) {
      beltView = assemblyLine.map((res, i) => {
        return (
          <tr key={i}>
            <td>{res.name}</td>
            <td>{res.code}</td>
          </tr>
        );
      });
    }
    return (
      <div className="col-12 col-md-12 col-lg-6 mb-4">
        <div className="tn-tabs tn-bg px-4 tabComponentBorder">
          <div className="row">
            <div
              className="close tn-close"
              onClick={this.props.handleCloseViewBelt}
            >
              <i className="close icon"></i>
            </div>

            <div className="col-12 my-4">
              <h1 class="m-0 p-0 tn-font-21">
                Location: {this.state.LocationName}
              </h1>
            </div>
            <div
              class="col-12"
              style={{ overflowX: "auto", overflowY: "auto", height: "370px" }}
            >
              <table class="ui celled single table tn-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: "150px" }}>Belt</th>
                    <th style={{ minWidth: "150px" }}>Belt Code</th>
                  </tr>
                </thead>
                <tbody>{beltView}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewBelts;
