import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {useDispatch } from "react-redux";
import Logo from "../../style/images/logo.svg";
import "../../style/css/login.css";
import BackgroundImage from "../../style/images/login_bg.svg";
import TextInput from "../common/textInput";
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../actions/loginAction';
import isEmpty from '../../validation/isEmpty';

const ChangePassword = ({ auth, changePassword }) => {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [errors, setErrors] = useState([]);
  const [showErrorDiv, setShowErrorDiv] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [onSubmitLogin, setOnSubmitLogin] = useState(false);

  const handleValidation = () => {
    let validationErrors = [];
    let formIsValid = true;

    if (!password) {
      formIsValid = false;
      validationErrors.push("Password cannot be empty");
    }

    if (!password1) {
      formIsValid = false;
      validationErrors.push("Confirm password cannot be empty");
    }

    if (password !== password1) {
      formIsValid = false;
      validationErrors.push("New password must match the confirm password");
    }

    if (!isEmpty(password)) {
      if (password.length > 14 || password.length < 6) {
        formIsValid = false;
        validationErrors.push("Password must be at least 6 to 14 characters");
      }
    }

    if (!formIsValid) {
      setErrors(validationErrors);
      setShowErrorDiv(true);
    }

    return formIsValid;
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setOnSubmitLogin(true);
    if (handleValidation()) {
      const passwordData = {
        id: auth.user.id,
        password: password
      };
      changePassword(passwordData, navigate);
    }
  };

  const cancelChangePassword = (e) => {
    e.preventDefault();
    let user = localStorage.getItem("user");
    user = JSON.parse(user);
    let Role = user.role;
    if (Role === 'Supervisor') {
      navigate('/manageWorkOrder');
    } else if (Role === 'Admin') {
      navigate('/masterdatamanagement');
    } else {
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
      localStorage.removeItem("adminSelectedTab");
      navigate('/login');
    }
  };


    useEffect(() => {
      dispatch({ type: "CLEAR_PASSWORD_RESET_ERROR" });
      setErrors([]);
      setShowErrorDiv(false);
      setOnSubmitLogin(false);
    }, [dispatch]);
  
  useEffect(() => {
    if (onSubmitLogin && auth.errorInProcessing) {
      
      setErrors(["unsuccessfully reset the password"]);
      setShowErrorDiv(true);
      onSubmitLogin(false);
    }
  }, [auth.errorInProcessing]);

  const errorBinding = errors.length !== 0 ? (
    errors.map((res, i) => <ul key={i + 1}><li>{res}</li></ul>)
  ) : null;

  const clsName = errors.length !== 0 ? "field error mb-4" : "field mb-4";
  const clsPassword = errors.length !== 0 ? "field error" : "field";

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6 p-0 tn-login-bg">
          <img
            src={BackgroundImage}
            className="img-fluid position-fixed"
            alt=""
            title=""
          />
        </div>
        <div className="col-6 p-0">
          <div className="tn-login">
            <div className="row">
              <div className="col-12 tn-login-w">
                <div className="w-100">
                  <img
                    src={Logo}
                    className="img-fluid"
                    alt=""
                    title=""
                    width="60"
                    height="60"
                  />
                  <span>Titan Watch Assembly</span>
                </div>
                <h2 className="my-2">
                  Enter new password and Submit to reset the password
                </h2>

                {showErrorDiv && (
                  <div className="col-12" style={{ color: "red", float: "left", width: "100%" }}>
                    {errorBinding}
                  </div>
                )}

                <form
                  className="ui fluid form"
                  onSubmit={onSubmitHandler}
                >
                  <div className={clsName}>
                    <TextInput
                      type="password"
                      name="password"
                      placeholder="New Password"
                      clsName="tn-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      error={auth.password}
                    />
                  </div>
                  <div className={clsPassword}>
                    <TextInput
                      type="password"
                      name="password1"
                      placeholder="Confirm Password"
                      clsName="tn-input"
                      value={password1}
                      onChange={(e) => setPassword1(e.target.value)}
                      error={auth.password1}
                    />
                  </div>
                  <div className="field">
                    <button
                      className="ui basic button tn-btn-primary my-4"
                      type="submit"
                    >
                      Submit
                    </button>
                    {!auth.user.changePasswordFlag && (
                      <button
                        className="ui basic button tn-btn-primary my-4"
                        type="button"
                        onClick={cancelChangePassword}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { changePassword })(ChangePassword);
