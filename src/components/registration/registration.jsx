import React from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import publicDB from "../../contractsJSON/publicDB";
import TextField from "@material-ui/core/TextField";
import { Tooltip, IconButton, Typography, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DoneIcon from "@material-ui/icons/Done";
import WarningIcon from "@material-ui/icons/Warning";
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
const Web3 = require("web3");
var web3 = new Web3();
var accountaddress;
var db;

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
      details: [],
      voters: [],
      authorised: [],
      reports: [],
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

    setTimeout(() => {
      this._update.bind(this)(true);
    }, 500);
  }
  _update(initialising) {
    db = new web3.eth.Contract(publicDB.abi, this.props.dbContractAddress);
    this.setState({ contractLoaded: false, voters: [], authorised: [], details: [], reports: [] })
    db.methods
      .voterCount()
      .call()
      .then(result => {
        this.setState({
          voterCount: result
        });
        for (var i = 0; i < result; i++) {
          db.methods
            .voters(i)
            .call()
            .then(result => {
              this.setState({
                voters: [...this.state.voters, result]
              });
            });
        }
        setTimeout(() => {

          for (var j = 0; j < result; j++) {
            db.methods
              .authorisation(this.state.voters[j])
              .call()
              .then(result => {
                this.setState({
                  authorised: [...this.state.authorised, result]
                })
              });
            db.methods
              .reports(this.state.voters[j])
              .call()
              .then(result => {
                this.setState({
                  reports: [...this.state.reports, result]
                })
              });
            db.methods
              .details(this.state.voters[j])
              .call()
              .then(result => {
                this.setState({
                  details: [...this.state.details, result]
                })
              });
          }
        }, 1000);
      });
    db.methods
      .owner()
      .call()
      .then(result => {
        this.setState({
          owner: result,
          contractLoaded: true,
          accountaddress: web3.givenProvider.selectedAddress
        });
      });
    if (initialising) {
      db.events
        .detailsAdded({}, (error, event) => { })
        .on("data", event => {
          console.log(event.returnValues);
          // this.setState({
          //   voters: [...this.state.voters, event.returnValues.addr],
          //   authorised: [...this.state.authorised, false],
          //   reports: [...this.state.reports, 0],
          //   details: [...this.state.details, event.returnValues.details]
          // });
          setTimeout(() => {            
            this._update.bind(this)(false);
        }, 1000);
      })
        .on("changed", event => {
          // remove event from local database
        })
        .on("error", console.error);
    }
  }

  register(details) {
    accountaddress = web3.givenProvider.selectedAddress;
    console.log([this.state.name, this.state.age].join('_=_'));
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
        this._update.bind(this)(false);
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log(confirmationNumber, receipt);
      })
      .on("error", error => alert(error.message))
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
      .on("error", error => alert(error.message))
      .then(() => {
        this._update.bind(this)(false);
      })
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
      .on("error", error => alert(error.message))
      .then(() => {
        this._update.bind(this)(false);
      })
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
      .on("error", error => alert(error.message))
      .then(() => {
        this._update.bind(this)(false);
      })
  }
  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    var { voterCount, voters } = this.state;
    if (!this.state.contractLoaded) {
      return (
        <CircularProgress />
      );
    }
    return (
      <div>
        <Typography variant="h6" align="left" style={{ fontFamily: "DM Serif Text", margin: 10 }}>{this.props.dbContractAddress}<br />Roll Supervisor<br /></Typography>
        {this.state.details[0] &&
          <div>
            <Typography variant="body1" style={{ fontFamily: 'Roboto Mono', textAlign: 'left', marginLeft: 30, marginBottom: 20 }}>
              Address: {this.state.voters[0]} <br />
              Name: {this.state.details[0].split('_=_')[0]}<br />
              Age: {this.state.details[0].split('_=_')[1]}
            </Typography>
          </div>}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', maxHeight: '60vh', overflow: 'auto' }}>
          <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>Democratic Roll</Typography>
          {voterCount && voters.length == voterCount && voters.map((item, index) => {
            if (index == 0) {
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
                      value={item}
                      fullwidth
                      disabled
                    />
                  </Tooltip>
                  <div>
                    {
                      this.state.authorised[index] ?
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
                    {this.state.owner && this.state.accountaddress &&
                      this.state.owner.toUpperCase() == this.state.accountaddress.toUpperCase() ? (
                        this.state.authorised[index] ?
                          <Tooltip title="__UNAUTHORISE__ this voter">
                            <IconButton
                              color="secondary"
                              onClick={(e) => { e.preventDefault(); this.unauthorise.bind(this)(item) }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Tooltip>
                          :
                          <Tooltip title="__AUTHORISE__ this voter">
                            <IconButton
                              color="primary"
                              onClick={(e) => { e.preventDefault(); this.authorise.bind(this)(item) }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Tooltip>
                      ) : <div />
                    }
                  </div>
                </div>
                {this.state.details[index] && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body1" style={{ fontFamily: 'Roboto Mono', textAlign: 'left', marginLeft: 10 }}>
                    Name: {this.state.details[index].split('_=_')[0]}<br />
                    Age: {this.state.details[index].split('_=_')[1]}<br />
                    {this.state.owner && this.state.accountaddress &&
                      this.state.owner.toUpperCase() == this.state.accountaddress.toUpperCase() ? 'User Reported: ' + this.state.reports[index] + ' times' : ''}
                  </Typography>
                  <Tooltip title="__REPORT__ this voter">
                    <Fab
                      size="small"
                      color="secondary"
                      variant="extended"
                      onClick={(e) => { e.preventDefault(); this.report.bind(this)(item) }}
                    >
                      Report Voter
                    </Fab>
                  </Tooltip>
                </div>}
              </div>
            )
          })}
        </div>
        <Typography variant="h6" align="left" style={{ fontFamily: "DM Serif Text", margin: "40px 10px 5px 20px" }}>Register</Typography>
        <form onSubmit={(e) => { e.preventDefault(); this.register.bind(this)() }}>
          <TextField style={{ margin: 5, width: "80%" }} id="name" value={this.state.name} required onChange={this._handleChange.bind(this)} label="Name" /><br />
          <TextField style={{ margin: 5, width: "80%" }} id="age" value={this.state.age} required onChange={this._handleChange.bind(this)} label="Age" /><br />
          <Button style={{ borderRadius: 50, margin: 10 }} variant="contained" color="primary" type="submit">Submit</Button>
        </form>
      </div>
    );
  }
}