
import './App.css';
import CreateAccount from "./CreateAccount";
import SignIn from './SignIn';
import Nav from './Nav';
import React, {Fragment} from 'react';
import {BrowserRouter as Router, Switch as Routes, Route, Link, Redirect} from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <Router>  
        <Fragment>     
      
        <Routes>   
        <Route exact path = "/">
            <Redirect to = "/signin"/>
        </Route>
        <Route path = "/signin">
          <Home/>
        </Route>
        <Route path="/createaccount">
            <CreateAccount/>
          </Route>
        </Routes>
        </Fragment>
        </Router>
       
    </div>
  );
}

const Home = ()=>(
  <div>
    
    <SignIn/>

    
  </div>
)
export default App;
