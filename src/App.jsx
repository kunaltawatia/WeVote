import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import CreateBallot from "./components/createBallot";
import NavBar from "./components/navbar";
import Candidatelist from "./components/profile/candidate_list";
import Profile from "./components/profile/profile";
import Registration from "./components/registration/registration";
import CreateDB from "./components/createDB/createDB";
import Vote from "./components/Vote";
import BuildPetition from "./components/buildPetition";
import Home from "./components/Home";
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractAddress: undefined
    };
  }
  _changeContractAddress(newState) {
    this.setState(newState);
    console.log(this.state, newState);
  }
  render() {
    return (
      <div className="App">
        <NavBar />
        <div style={{
          // marginTop:'10vh'
        }}>

          <Router>
            <Route
              exact
              path="/"
              render={() => (
                <Home />
              )}
            />
            <Route
              path="/createPoll"
              render={() => (
                <CreateBallot
                  _handleContractAddress={this._changeContractAddress.bind(this)}
                />
              )}
            />
            <Route
              exact
              path="/buildPetition"
              render={() => (
                <BuildPetition
                  _handleContractAddress={this._changeContractAddress.bind(this)}
                />
              )}
            />
            <Route
              path="/vote"
              render={() => (
                <Vote
                  contractAddress={this.state.contractAddress}
                  votingContractType={this.state.votingContractType}
                  _handleContractAddress={this._changeContractAddress.bind(this)}
                />
              )}
            />
            <Route
              path="/registration"
              render={() => (
                <Registration dbContractAddress={this.state.dbContractAddress}
                  _handleContractAddress={this._changeContractAddress.bind(this)} />
              )}
            />

           

            <Route
              path="/createDatabase"
              render={() => (
                <CreateDB
                  _handleContractAddress={this._changeContractAddress.bind(this)}
                />
              )}
            />


            <Route
              exact
              path="/profile"
              render={() => (
                <div>
                  <NavBar />
                  <Candidatelist />
                </div>

              )}
            />

            <Route path="/profile/:id" render={(props) => <Profile {...props} />} />

          </Router>
        </div>
      </div>
    );
  }
}
