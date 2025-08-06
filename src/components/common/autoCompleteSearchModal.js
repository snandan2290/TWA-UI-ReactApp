import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class AutoCompleteSearchModal extends Component {


  render() {
    
    let oprtionArray = [{text: "", value: ""},...this.props.optionsList ];

    return (
      <Dropdown
        className="ui search dropdown w-100 tn-multi-dropdown selection"
        placeholder="Select"
        fluid
        search
        selection
        value={this.props.text}
        options={oprtionArray}
        onChange={this.props.handleOnChangeEvent}
      />
    );
  }
}

export default AutoCompleteSearchModal;
