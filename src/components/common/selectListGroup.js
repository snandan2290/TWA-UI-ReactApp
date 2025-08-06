import React from "react";

const SelectListGroup = props => {
  const selectOptions = props.options.map((option, index) => {
    return (
      <option
        style={{ fontSize: "15px", fontWeight: "400" }}
        key={index}
        value={option.value}
      >
        {option.label}
      </option>
    );
  });

  return (
    <div>
      <select
        name={props.name}
        className="ui search dropdown w-100 tn-multi-dropdown selection"
        value={props.value}
        onChange={props.onChange}
        options={props.options}
      >
        <option style={{ fontSize: "15px", fontWeight: "400" }} value="">
          Select
        </option>
        {selectOptions}
      </select>
    </div>
  );
};

export default SelectListGroup;
