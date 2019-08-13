import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import publicDB from "../../contractsJSON/publicDB";
import TextField from "@material-ui/core/TextField";
import { Tooltip, Typography, Grid, Select } from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
const Web3 = require("web3");
var web3 = new Web3();
var accountaddress;
var db;

export default class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputAddress: ''
    };
  }
  componentDidMount() {
    // Modern DApp Browsers
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function () {
          // User has allowed account access to DApp...
          accountaddress = web3.givenProvider.selectedAddress;
        });
      } catch (err) {
        // User has denied account access to DApp...
        alert("You have denied access to MetaMask request. Reload the page. ");
      }
    }
    // Legacy DApp Browsers
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-DApp Browsers
    else {
      alert("You have to install MetaMask extension for your browser !");
    }
  }

  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    return (
      <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.6)', maxWidth: '60vw' }} className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
        <br />
        {!this.props.dbContractAddress && (
          <form onSubmit={(e) => {
            e.preventDefault();
            this.props._handleContractAddress({ "dbContractAddress": this.state.inputAddress });
          }}>
            <TextField
              id="inputAddress"
              value={this.state.inputAddress}
              onChange={this._handleChange.bind(this)}
              autoComplete="off"
            />
            <Button
              type="submit"
            >
              Load Database Contract
            </Button>
          </form>
        )}

        {this.props.dbContractAddress && <VotingComponent {...this.props} />}

      </Card>
    );
  }
}

class VotingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      contractLoaded: false,
      details: ''
    }
  }
  componentDidMount() {
    db = new web3.eth.Contract(publicDB.abi, this.props.dbContractAddress);
    setTimeout(() => {
      this._update.bind(this)();
    }, 500);
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function () {
          // User has allowed account access to DApp...
          accountaddress = web3.givenProvider.selectedAddress;
        });
      } catch (err) {
        // User has denied account access to DApp...
        alert("You have denied access to MetaMask request. Reload the page. ");
      }
    }
    // Legacy DApp Browsers
    else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-DApp Browsers
    else {
      alert("You have to install MetaMask extension for your browser !");
    }
  }
  _update() {
    this.setState({ contractLoaded: false })
    db.methods
      .getDetails(web3.givenProvider.selectedAddress)
      .call()
      .then(result => {
        console.log('address', result);
        this.setState({
          result: result,
          contractLoaded: true
        });
      });
  }

  register(details) {
    accountaddress = web3.givenProvider.selectedAddress;
    var mygas;
    db.methods
      .addDetails(details)
      .estimateGas({ from: accountaddress })
      .then(function (gasAmount) {
        mygas = gasAmount;
      });
    db.methods
      .addDetails(details)
      .send({
        from: web3.givenProvider.selectedAddress,
        gas: 1308700,
        gasPrice: web3.eth.gasPrice,
        gasLimit: 2000000
      })
      .on("transactionHash", hash => {
        console.log(hash);
      })
      .on("receipt", receipt => {
        console.log(receipt);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(confirmationNumber, receipt);
      })
      .on("error", error => alert(error.message))
      .then(()=>{
        this._update.bind(this)();
      })
  }

  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    if (!this.state.contractLoaded) {
      return (
        <CircularProgress />
      );
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
        {this.state.result.length > 0 &&
          <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>Registered Under {this.props.dbContractAddress} as:<br />{this.state.result}</Typography>
        }
        {
          this.state.result.length == 0 &&
          <form onSubmit={(e) => { e.preventDefault(); this.register.bind(this)(this.state.details) }}>
            <TextField id="details" value={this.state.details} onChange={this._handleChange.bind(this)} />
            <Button type="submit">Submit</Button>
          </form>
        }
      </div>
    );
  }
}