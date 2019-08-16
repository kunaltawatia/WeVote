/* eslint-disable no-loop-func */
import React from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import publicDB from "../../contractsJSON/publicDB";
import TextField from "@material-ui/core/TextField";
import { Tooltip, IconButton, Typography, Fab, Divider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import WarningIcon from "@material-ui/icons/Warning";
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
const Web3 = require("web3");
var web3 = new Web3();
var accountaddress;
var db;
var apiResponse = {};

export default class App extends React.Component {
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
      <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.9)', maxWidth: '60vw' }} className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
        <br />
        {!this.props.dbContractAddress && (
          <form onSubmit={(e) => {
            e.preventDefault();
            this.props._handleContractAddress({ "dbContractAddress": this.state.inputAddress });
          }}>
            <TextField
              style={{
                margin: 20,
                padding: 20,
                width: '80%',
              }}
              id="inputAddress"
              value={this.state.inputAddress}
              onChange={this._handleChange.bind(this)}
              autoComplete="off"
              placeholder='Database Contract Address'
            />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button style={{ borderRadius: 50, margin: 10 }}
                type="submit"
                color="primary"
                variant="contained"
              >
                Load Database Contract
            </Button>
            </div>
          </form>
        )}

        {this.props.dbContractAddress && <Database {...this.props} />}

      </Card>
    );
  }
}

class Database extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: '',
      contractLoaded: false,
      update: 1
    }
  }
  componentDidMount() {
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
    fetch(`/api/publicDB/${this.props.dbContractAddress}`)
      .then(res => res.json())
      .then(data => {
        this.setState(data);
        apiResponse = data;
        setTimeout(() => {
          this.setState({ contractLoaded: true })
          console.log(this.state, 'state')
          console.log('response', apiResponse, apiResponse.details)
        }, 500);
      });
    db = new web3.eth.Contract(publicDB.abi, this.props.dbContractAddress);
    db.events
      .detailsAdded({}, (error, event) => { })
      .on("data", event => {
        console.log(event.returnValues);
        if (apiResponse.details[event.returnValues.addr])
          apiResponse.details[event.returnValues.addr] = event.returnValues.details;
        else {
          apiResponse.voters.push(event.returnValues.addr);
          apiResponse.details[event.returnValues.addr] = event.returnValues.details;
          apiResponse.reports[event.returnValues.addr] = 0;
          apiResponse.authorised[event.returnValues.addr] = event.returnValues.false;
        }
        setTimeout(() => {
          this.setState({ update: this.state.update + 1 })
        }, 50);
      })
      .on("changed", event => {
        // remove event from local database
      })
      .on("error", console.error);
    db.events
      .voterAuthorised({}, (error, event) => { })
      .on("data", event => {
        console.log(event.returnValues);
        apiResponse.authorised[event.returnValues.voter] = true;
        setTimeout(() => {
          this.setState({ update: this.state.update + 1 })
        }, 50);
      })
      .on("changed", event => {
        // remove event from local database
      })
      .on("error", console.error);
    db.events
      .voterUnauthorised({}, (error, event) => { })
      .on("data", event => {
        console.log(event.returnValues);
        apiResponse.reports[event.returnValues.voter] += 1;
        apiResponse.authorised[event.returnValues.voter] = false;
        setTimeout(() => {
          this.setState({ update: this.state.update + 1 })
        }, 50);
      })
      .on("changed", event => {
        // remove event from local database
      })
      .on("error", console.error);
    db.events
      .voterReported({}, (error, event) => { })
      .on("data", event => {
        console.log(event.returnValues);
        apiResponse.reports[event.returnValues.voter] += 0.25;
        setTimeout(() => {
          this.setState({ update: this.state.update + 1 })
        }, 50);
      })
      .on("changed", event => {
        // remove event from local database
      })
      .on("error", console.error);
  }

  register(details) {
    accountaddress = web3.givenProvider.selectedAddress;
    this.setState({ registrationLoading: true });
    db.methods
      .addDetails([this.state.name, this.state.age].join('_=_'))
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
      .then(() => {
        this.setState({ name: '', age: '', registrationLoading: false });
      })
  }
  authorise(address) {
    db.methods
      .authorise(address)
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
      .on("error", error => alert(error.message));
  }
  unauthorise(address) {
    db.methods
      .unAuthorise(address)
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
      .on("error", error => alert(error.message));
  }
  report(address) {
    db.methods
      .report(address)
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
      .on("error", error => alert(error.message));
  }
  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    return (
      <div>
        <Typography variant="h6" align="center" style={{ fontFamily: "DM Serif Text", margin: 10 }}>Database<br />{this.props.dbContractAddress}
        </Typography>
        <Divider style={{ margin: 5, height: 5 }} />
        <Typography variant="h6" align="left" style={{ fontFamily: "DM Serif Text", margin: 10 }}>Roll Supervisor<br /></Typography>
        {apiResponse.details && apiResponse.details[apiResponse.owner] ?
          <div>
            <Typography variant="body1" style={{ fontFamily: 'Roboto Mono', textAlign: 'left', marginLeft: 30, marginBottom: 20 }}>
              Address: {apiResponse.owner} <br />
              Name: {apiResponse.details[apiResponse.owner].split('_=_')[0]}<br />
              Age: {apiResponse.details[apiResponse.owner].split('_=_')[1]}
            </Typography>
          </div> : <CircularProgress style={{ margin: 10 }} />
        }
        <Divider style={{ margin: 5, height: 5 }} />

        <div>
          <Typography variant="h6" align="left" style={{ fontFamily: "DM Serif Text", margin: "40px 10px 5px 20px" }}>Register/Update your details</Typography>
          <form onSubmit={(e) => { e.preventDefault(); this.register.bind(this)() }}>
            <TextField style={{ margin: 5, width: "80%" }} variant="outlined" id="name" value={this.state.name} required onChange={this._handleChange.bind(this)} label="Name" /><br />
            <TextField style={{ margin: 5, width: "80%" }} variant="outlined" id="age" value={this.state.age} required onChange={this._handleChange.bind(this)} label="Age" /><br />
            {
              this.state.registrationLoading ? <CircularProgress style={{ margin: 10 }} /> :
                <Button style={{ borderRadius: 50, margin: 10 }} variant="contained" color="primary" type="submit">Submit</Button>
            }
          </form>
        </div>
        <Divider style={{ margin: 5, height: 5 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', maxHeight: '100vh', overflow: 'auto' }}>
          <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>Democratic Roll</Typography>
          {apiResponse.voters ? apiResponse.voters.map((voter) => {
            if (voter.toUpperCase() == apiResponse.owner.toUpperCase()) {
              return (<div />)
            }
            return (
              <div style={{ borderRadius: 10, boxShadow: '1.5px 1.5px 10.5px 5.5px #888888', margin: 10 }} class="card">
                <div style={{ margin: 10, padding: 10 }} class="input-root">
                  <Tooltip title="Voter Address">
                    <input style={{
                      width: 400,
                      backgroundColor: 'white',
                    }}
                      className="option-input"
                      value={voter}
                      fullwidth
                      disabled
                    />
                  </Tooltip>
                  <div>
                    {apiResponse.authorised &&
                      apiResponse.authorised[voter] ?
                      <Tooltip title="Authorised Voter">
                        <IconButton
                          style={{
                            backgroundColor: 'green'
                          }}>
                          <DoneIcon />
                        </IconButton>
                      </Tooltip> :
                      <Tooltip title="Unauthorised Voter">
                        <IconButton
                          style={{
                            backgroundColor: 'orange'
                          }}>
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    }
                    {apiResponse.owner.toUpperCase() == accountaddress.toUpperCase() ? (
                      apiResponse.authorised[voter] ?
                        <Tooltip title="__UNAUTHORISE__ this voter">
                          <IconButton
                            color="secondary"
                            onClick={(e) => { e.preventDefault(); this.unauthorise.bind(this)(voter) }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="__AUTHORISE__ this voter">
                          <IconButton
                            color="primary"
                            onClick={(e) => { e.preventDefault(); this.authorise.bind(this)(voter) }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                    ) : <div />
                    }
                  </div>
                </div>
                {apiResponse.details && apiResponse.details[voter] && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" style={{ fontFamily: 'Roboto Mono', textAlign: 'left', marginLeft: 10 }}>
                    Name: {apiResponse.details[voter].split('_=_')[0]}<br />
                    Age: {apiResponse.details[voter].split('_=_')[1]}<br />
                    {apiResponse.owner.toUpperCase() == accountaddress.toUpperCase() ? 'User Reported: ' + apiResponse.reports[voter] + ' times' : ''}
                  </Typography>
                  <Tooltip title="__REPORT__ this voter">
                    <Fab
                      size="small"
                      color="secondary"
                      variant="extended"
                      onClick={(e) => { e.preventDefault(); this.report.bind(this)(voter) }}
                    >
                      Report Voter
                    </Fab>
                  </Tooltip>
                </div>}
              </div>
            )
          }) : <CircularProgress style={{ margin: 10 }} />
          }
        </div>
      </div>
    );
  }
}