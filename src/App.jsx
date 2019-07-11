import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import CreateBallot from "./components/createBallot";
import Vote from "./components/Vote";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractAddress: undefined
    };
  }
  _changeContractAddress(_address) {
    this.setState({
      contractAddress: _address
    });
  }
  render() {
    return (
      <div className="App">
        <Router>
          <Route
            exact
            path="/"
            // component={hello}
            render={() => (
              <CreateBallot
                _handleContractAddress={this._changeContractAddress.bind(this)}
              />
            )}
          />
          <Route
            path="/vote"
            render={() => (
              <Vote
                contractAddress={this.state.contractAddress}
                _handleContractAddress={this._changeContractAddress.bind(this)}
              />
            )}
          />
        </Router>
      </div>
    );
  }
}
