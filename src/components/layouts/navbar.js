import React, { useState, useEffect, useCallback } from "react";
import SideNavbar from "./sideNavbar";
import "../../style/css/navbar.css";
import { connect } from "react-redux";
import Logo from "../../style/images/logo.svg";
import Profile from "../../style/images/profile.svg";
import Dropdownnavbar from "../common/dropdown";
import { logOutUser } from "../../actions/loginAction";
import { useNavigate } from "react-router-dom";
import TimeoutAlertModal from "../common/timeoutAlertModal";

const Navbar = ({ auth, logOutUser }) => {
  const [messageValue, setMessageValue] = useState("");
  const [showMessageDiv, setShowMessageDiv] = useState(false);

  const events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"];
  const navigate = useNavigate();
  let warnTimeout = null;
  let logoutTimeout = null;

  const clearTimeouts = useCallback(() => {
    if (warnTimeout) clearTimeout(warnTimeout);
    if (logoutTimeout) clearTimeout(logoutTimeout);
  }, []);

  const setTimeouts = useCallback(() => {
    warnTimeout = setTimeout(() => warn(), 900000); // 15 minutes
    logoutTimeout = setTimeout(() => logout(), 1200000); // 20 minutes
  }, []);

  const resetTimeouts = useCallback(() => {
    clearTimeouts();
    setTimeouts();
  }, [clearTimeouts, setTimeouts]);

  const warn = useCallback(() => {
    setShowMessageDiv(true);
    setMessageValue("You will be logged out automatically in 1 minute.");
  }, []);

  const logout = useCallback(() => {
    logOutUser();
    logoutHandler();
  }, [logOutUser]);

  const logoutHandler = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const changePasswordHandler = useCallback(() => {
    navigate("/changepassword");
  }, [navigate]);


  const onModalCloseHandler = useCallback(() => {
    resetTimeouts();
    setShowMessageDiv(false);
  }, [resetTimeouts]);
  useEffect(() => {
    setTimeouts();

    events.forEach((event) => {
      window.addEventListener(event, resetTimeouts);
    });

    return () => {
      clearTimeouts();
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeouts);
      });
    };
  }, [clearTimeouts, resetTimeouts, setTimeouts]);

  const user = auth.user;

  return (
    <nav className="navbar col-12 p-0 fixed-top d-flex flex-row navbar-bg">
      {showMessageDiv && (
        <TimeoutAlertModal
          isOpen={true}
          message={messageValue}
          handleOkClick={onModalCloseHandler}
        />
      )}
      <div className="navbar-brand-wrapper text-center d-flex align-items-center justify-content-center">
        <SideNavbar />
      </div>
      <div className="navbar-menu-wrapper">
        <div className="row m-0 justify-content-center">
          <div className="col-11 p-0">
            <div className="float-left px-4 align-self-center py-2">
              <div className="logo">
                <img
                  src={Logo}
                  className="img-fluid"
                  alt=""
                  title=""
                  width="40"
                  height="40"
                />
                <span>Titan Watch Assembly</span>
              </div>
            </div>
            <div className="float-right px-4">
              <div className="ui dropdown button px-0 tn-dropdown">
                <div className="float-left">
                  {user.username}
                  <br />
                  <span className="tn-text">{user.role}</span>
                </div>
                <Dropdownnavbar
                  logout={logout}
                  ChangePassword={changePasswordHandler}
                />
                
                <i className="px-2">
                  <img
                    src={Profile}
                    className="img-fluid"
                    width="30"
                    height="30"
                    alt=""
                  />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logOutUser })(Navbar);
