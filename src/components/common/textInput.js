import React from "react";

function TextInput({
  name,
  value,
  type,
  placeholder,
  error,
  info,
  onChange,
  disabled,
  maxlength
}) {
  return (
    <div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxlength}
        className="tn-input"
        autoComplete="off"
        style={{MozAppearance:"textfield"}}
        />
        {info && <small className = 'form-text text-muted'>{info}</small>}
        {error && <div className='invalid-feedback'>{error}</div>}
        </div>
    )

}

export default TextInput;
