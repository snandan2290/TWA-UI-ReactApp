import React, { Component } from 'react'
import { Dropdown } from "semantic-ui-react";

class SelectDropdown extends Component {
  render() {
    let oprtionArray = [
        {text: "10", value: "10"},
        {text: "25", value: "25"},
        {text: "50", value: "50"},
        {text: "100", value: "100"}
];
    return (
        <Dropdown
        className="ui dropdown tn-dropdown-show mx-2"
        options={oprtionArray}
        onChange={this.props.handleOnChangeEvent}
        style={{ padding:"10px"}}
        defaultValue="10"
      />
    )
  }
}

export default SelectDropdown;
