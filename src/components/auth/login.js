import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "../../style/images/logo.svg";
import "../../style/css/login.css";
import BackgroundImage from "../../style/images/login_bg.svg";
import TextInput from "../common/textInput";
import { login } from "../../actions/loginAction";
import isEmpty from "../../validation/isEmpty";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorDiv, setShowErrorDiv] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isRemember, setIsRemember] = useState(false);
  const [onSubmitLogin, setOnSubmitLogin] = useState(false);

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (!isEmpty(userName) && !isEmpty(password)) {
      setEmail(userName);
      setPassword(password);
      setIsRemember(true);
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "CLEAR_AUTH_ERRORS" });
    setErrors([]);
    setShowErrorDiv(false);
  }, [dispatch]);

  useEffect(() => {
    if (auth.isAuthenticated) {
      setOnSubmitLogin(true);

      if (auth.user.changePasswordFlag) {
        navigate("/changepassword");
      } else if (auth.user.role === "Supervisor") {
        navigate("/manageWorkOrder");
      } else if (auth.user.role === "Admin") {
        navigate("/masterdatamanagement");
      } else if (auth.user.role === "Operator" && auth.user.isAdmin === true) {
        navigate("/masterdatamanagement");
      }
    }

    if (onSubmitLogin && auth.errorInProcessing) {
      setErrors(["Authentication Failed"]);
      setShowErrorDiv(true);
    }

    if (onSubmitLogin && auth.operatorAuthError) {
      setErrors(["Operator access denied"]);
      setShowErrorDiv(true);
    }
  }, [auth, navigate]);

  const handleValidation = () => {
    const validationErrors = [];
    let formIsValid = true;

    if (!email) {
      formIsValid = false;
      validationErrors.push("User Name cannot be empty");
    }

    if (!password) {
      formIsValid = false;
      validationErrors.push("Password cannot be empty");
    }

    if (!formIsValid) {
      setErrors(validationErrors);
      setShowErrorDiv(true);
    }

    return formIsValid;
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const userData = {
        username: email,
        password: password,
      };
      dispatch(login(userData));
    }
    setOnSubmitLogin(true);
  };

  useEffect(() => {
    if (!isEmpty(email) && !isEmpty(password) && isRemember && onSubmitLogin) {
      localStorage.setItem("username", email);
      localStorage.setItem("password", password);
    } else if (
      !isEmpty(email) &&
      !isEmpty(password) &&
      !isRemember &&
      onSubmitLogin
    ) {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
    }
  }, [email, password, isRemember, onSubmitLogin]);

  const errorBinding =
    errors.length !== 0
      ? errors.map((res, i) => (
          <ul className="tn-login-error" key={i + 1}>
            {res ? <li>{res}</li> : ""}
          </ul>
        ))
      : null;

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
                  Welcome back! Please login to your account.
                </h2>

                {showErrorDiv && (
                  <div
                    className="col-12 mb-3"
                    style={{ color: "red", float: "left" }}
                  >
                    {errorBinding}
                  </div>
                )}

                <form className="ui fluid form" onSubmit={onSubmitHandler}>
                  <div className={clsName}>
                    <input
                      type="text"
                      name="email"
                      placeholder="Employee Code"
                      className="tn-input"
                      maxLength="50"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="on"
                    />
                  </div>
                  <div className={clsPassword}>
                    <TextInput
                      type="password"
                      name="password"
                      placeholder="Password"
                      clsName="tn-input"
                      maxlength="50"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <div className="ui checkbox float-left">
                      <input
                        type="checkbox"
                        checked={isRemember}
                        onChange={() => setIsRemember(!isRemember)}
                      />
                      <label>Remember me</label>
                    </div>
                  </div>
                  <div className="field">
                    <button
                      className="ui basic button tn-btn-primary my-4"
                      type="submit"
                    >
                      Login
                    </button>
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

export default Login;
