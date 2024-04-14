import React, { Component } from 'react';
import ProgrammingLanguage from './ProgrammingLanguage';

class VoteApp extends Component {
  render () {    
    return (
      <main role="main">
        <div class="jumbotron">
          <div class="container">
            <h1 class="display-3">Language Vote App v1</h1>
            &copy; CloudAcademy ❤ Sudha 2024
          </div>
        </div>

        <div class="container">
          <div className="row">
            <div className="col-md-4">
              <ProgrammingLanguage id="csharp" logo="csharp.jpg"/>
            </div>
            <div className="col-md-4">
              <ProgrammingLanguage id="python" logo="python.png"/>
            </div>
            <div className="col-md-4">
              <ProgrammingLanguage id="javascript" logo="javascript.png"/>
            </div>
          </div>
          <hr></hr>
          <div class="row">
            <div class="col-md-4">
              <ProgrammingLanguage id="go" logo="go.png"/>
            </div>
            <div class="col-md-4">
              <ProgrammingLanguage id="java" logo="java.png"/>
            </div>
            <div class="col-md-4">
              <ProgrammingLanguage id="nodejs" logo="nodejs.png"/>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

//Cexport the VoteApp class, allows the ReactDOM.render within the index.js file to use it
export default VoteApp;
