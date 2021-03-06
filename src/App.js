import React, { Component } from 'react';
import './App.css';
import SearchResultContainer from './Containers/SearchResultContainer'
import Home from './Containers/Home'
import ProfilePage from './Containers/ProfilePage'
import EstablishmentPage from './Containers/EstablishmentPage'
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

class App extends Component {
  state = {
    term: "",
    location: "Queens",
    results: [],
    establishment:{},
    establishment_reviews:[],
    user: {},
    logged_in: false,
    errorMsg: null
  }

  componentDidMount() {
    if (localStorage.getItem("token")) {
      let token = localStorage.getItem("token");
      let option = {
        headers: {
          "Content-Type": "application/json",
          Accepts: "application/json",
          Authorization: `Bearer ${token}`
        }
      }
      fetch("http://localhost:3001/api/v1/profile", option)
        .then(resp => resp.json())
        .then(data => this.setState({ user: data.user }))
    } else {
      this.props.history.push("/");
    }
  }
  //-------------------------------//
  changeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //-------------------------------//
  submitHandler = (e) => {
    e.preventDefault();
    let option = {
      method: 'POST',
      headers:{
        'content-type': "application/json",
      },
      body: JSON.stringify({
        term: this.state.term,
        location: this.state.location
      })
    }
    fetch('http://localhost:3001/api/v1/establishments', option)
    .then(res => res.json())
    .then(data => {
      this.setState({results: data}, () => this.props.history.push('/search'))
     })
     .catch(console.error)
  }
  //-----------check persistData is needed anymore--------------------//

  persistData = (data) => {
    if(data.categories){
      this.setState({establishment:data})
    }
    else if(data.review_text){
      this.setState({establishment_reviews: data})
    }
    else if(data.bio){
      this.setState({user:data})
    }
  }

  //-------------------------------//
  clickHandler = (e, searchObj) => {
    let id = searchObj.id
    let establishment = this.state.results.find(result => result.id === id)
    this.setState({
      establishment: establishment
    })
    this.props.history.push(`/establishments/${establishment.id}`)
  }

//-------------------------------//
signupHandler = (e, signupObj) => {
  e.preventDefault();
  let option = {
    method: 'POST',
    headers:{
      'content-type': "application/json",
    },
    body: JSON.stringify({
      user: {
        first_name:signupObj.first_name,
        username: signupObj.username,
        password: signupObj.password,
        bio: signupObj.bio,
      }
    })
  }
  fetch('http://localhost:3001/api/v1/users', option)
    .then(res => res.json())
    .then(data => {
      this.setState({user: data.user})
      this.setState({logged_in: true})
      localStorage.setItem('token', data.jwt)
      this.props.history.push(`/profile/${data.user.id}`)
    })
}

//-----------------------------//
loginHandler = (e, userObj) => {
  e.preventDefault();
  let option = {
    method: 'POST',
    headers:{
      'content-type': "application/json",
    },
    body: JSON.stringify({
      user: {
        username: userObj.username,
        password: userObj.password
      }
    })
  }
  fetch('http://localhost:3001/api/v1/login', option)
  .then(res => {
    if (res.status < '401') {
        res.json().then(data => {
        this.setState({user: data.user})
        this.setState({logged_in: true})
        localStorage.setItem('token', data.jwt)
        this.props.history.push(`/profile/${data.user.id}`)
      })
    } else {
      res.json().then(json => {
        console.log(json.message)
        this.setState({ errorMsg: json.message })
      })
    }}
  )
  .catch(console.error)
}

//-----------------------------//
logoutHandler = () => {
  localStorage.removeItem('token')
  window.location.reload();
}

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact path="/"
            render={(props) => <Home {...props}
            search={this.state}
            changeHandler={this.changeHandler}
            submitHandler={this.submitHandler}
            loginHandler={this.loginHandler}
            logoutHandler={this.logoutHandler}
            signupHandler={this.signupHandler}
            errorMsg={this.state.errorMsg}/>} />
          <Route
            path="/profile"
            render={(props) => <ProfilePage {...props}
            search={this.state}
            changeHandler={this.changeHandler}
            submitHandler={this.submitHandler}
            persistData={this.persistData}/>}/>
          <Route
            path="/search"
            render={(props) => <SearchResultContainer {...props}
            search={this.state}
            changeHandler={this.changeHandler}
            clickHandler={this.clickHandler}
            submitHandler={this.submitHandler}
            /> }/>
          <Route
            path="/establishments/:id"
            render={(props) => {
              return <EstablishmentPage {...props}
              search={this.state}
              changeHandler={this.changeHandler}
              submitHandler={this.submitHandler} reviewSubmitHandler={this.reviewSubmitHandler}
              loginHandler={this.loginHandler}
              user={this.state.user}/>
            }}/>
        </Switch>
      </div>
  );
}
    //<Route component={NoMatch} />
    //localStorage.setItem("establishment", JSON.stringify(this.state.establishment)
}
export default withRouter(App);
