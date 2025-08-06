import React from "react";
import { Dropdown } from "semantic-ui-react";

const Dropdownnavbar = props => (
  <Dropdown>
    <Dropdown.Menu
      className="h-dropdown"
      style={{ border: "none", boxShadow: "1px 3px 6px rgba(107,107,107,0.1)" }}
    >
      <Dropdown.Item text="Change Password" onClick={props.ChangePassword}/>
      <Dropdown.Item onClick={props.logout} text="Logout" />

    </Dropdown.Menu>
  </Dropdown>
);

export default Dropdownnavbar;
