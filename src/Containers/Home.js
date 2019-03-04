// Landing Page
// we want to render
// 1. Logo & login & sign up buttons
// 2. SearchForm

import React, { Component } from 'react';
import SearchForm from '../Components/SearchForm'
import LoginForm from '../Components/LoginForm'
import SignUpForm from '../Components/SignUpForm'
import Popup from "reactjs-popup";

class Home extends Component {

  render() {
    return (
      <div>
        <Popup trigger={
            <div className="ui button" onClick> Login </div>} modal
            position="right center">
            <div>{<LoginForm changeHandler={this.props.changeHandler} loginHandler={this.props.loginHandler}/>}</div>
        </Popup>

        <Popup trigger={
            <div className="ui button" onClick> Sign Up </div>} modal
            position="right center">
            <div>{<SignUpForm changeHandler={this.props.changeHandler} signupHandler={this.props.signupHandler}/>}</div>
        </Popup>
          <h1 className="main-title">SaveSpace<span id="nyc">nyc</span></h1>
          <SearchForm className="search" changeHandler={this.props.changeHandler} term={this.props.term} location={this.props.location} submitHandler={this.props.submitHandler}/>
      </div>
    );
  }

}

export default Home;
