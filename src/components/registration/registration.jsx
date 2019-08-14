import React from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import publicDB from "../../contractsJSON/publicDB";
import TextField from "@material-ui/core/TextField";
import { Tooltip, IconButton, Typography } from "@material-ui/core";
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
      <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.6)', maxWidth: '60vw' }} className="card">
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
      this._update.bind(this)();
    }, 500);
  }
  _update() {
    db = new web3.eth.Contract(publicDB.abi, this.props.dbContractAddress);
    this.setState({ contractLoaded: false,voters:[],authorised:[],details:[],reports:[] })
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
        }, 600);
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
      .then(() => {
        this._update.bind(this)();
        this.setState({ redirect: true });
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
      .on("error", error => alert(error.message))
      .then(() => {
        this._update.bind(this)();
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
        this._update.bind(this)();
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
        this._update.bind(this)();
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
    if (this.state.redirect) {
      return <Redirect to="/vote" />
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', maxHeight: '80vh', overflow: 'auto' }}>
        {/* {this.state.result.length > 0 &&
          <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>Registered Under {this.props.dbContractAddress} as:<br />{this.state.result}</Typography>
        } */}
        {/* {
          this.state.result.length == 0 &&
          <form onSubmit={(e) => { e.preventDefault(); this.register.bind(this)(this.state.details) }}>
            <TextField id="details" value={this.state.details} onChange={this._handleChange.bind(this)} />
            <Button style={{ borderRadius: 50, margin: 10 }} type="submit">Submit</Button>
          </form>
        } */}
        {voterCount && voters.length == voterCount && voters.map((item, index) => {
          return (
            <div>
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
                    this.state.authorised[index] &&
                    <Tooltip title="Authorised Voter">
                      <IconButton
                        style={{
                          backgroundColor: 'green'
                        }}>
                        <DoneIcon />
                      </IconButton>
                    </Tooltip>
                  }
                  {this.state.owner && this.state.accountaddress &&
                    this.state.owner.toUpperCase() == this.state.accountaddress.toUpperCase() ? (
                      this.state.authorised[index] ?
                        <Tooltip title="__UNAUTHORISE__ this voter">
                          <IconButton
                            color="secondary"
                            onClick={(e)=>{e.preventDefault();this.unauthorise.bind(this)(item)}}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                        :
                        <Tooltip title="__AUTHORISE__ this voter">
                          <IconButton
                            color="primary"
                            onClick={(e)=>{e.preventDefault();this.authorise.bind(this)(item)}}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                    ) : <Tooltip title="__REPORT__ this voter">
                      <IconButton
                        color="secondary"
                        onClick={(e)=>{e.preventDefault();this.report.bind(this)(item)}}
                      >
                        <WarningIcon />
                      </IconButton>
                    </Tooltip>
                  }
                </div>
              </div>
              {this.state.details[index] && <div style={{ backgroundColor: 'white', borderRadius: 50, boxShadow: '1.5px 1.5px 1.5px 0.5px #888888' }} class="card">
                <Typography variant="body1" style={{ fontFamily: 'Roboto Mono' }}>
                  Name: {this.state.details[index].split('_=_')[0]}<br />
                  Age: {this.state.details[index].split('_=_')[1]}<br />
                  User Reported: {this.state.reports[index]} times
                </Typography>
              </div>}
            </div>
          )
        })}
      </div>
    );
  }
}