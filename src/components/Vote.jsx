import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import ballot from "../contractsJSON/publicPoll";
import authenticatedBallot from "../contractsJSON/authenticatedPoll";
import TextField from "@material-ui/core/TextField";
import { Tooltip, Typography, Grid, Select } from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
const Web3 = require("web3");
var web3 = new Web3();
var accountaddress;
var Ballot;

export default class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: undefined,
      optionCount: 0,
      options: [],
      contractLoaded: false,
      result: [],
      voted: 0,
      votingContractType: 'unauthenticated'
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
        {!this.props.contractAddress && (
          <form onSubmit={(e) => {
            e.preventDefault();
            this.props._handleContractAddress({ "contractAddress": this.state.inputAddress, "votingContractType": this.state.votingContractType });
          }}>
            <TextField
              id="inputAddress"
              value={this.state.inputAddress}
              onChange={this._handleChange.bind(this)}
              autoComplete="off"
            />
            <Select
              native
              value={this.state.votingContractType}
              onChange={this._handleChange.bind(this)}
              inputProps={{
                id: 'votingContractType',
              }}
            >
              <option value="unauthenticated">Unauthenticated Voting</option>
              <option value="authenticated">Authenticated Voting</option>
            </Select>
            <Button
              type="submit"
            >
              Load
            </Button>
          </form>
        )}

        {this.props.contractAddress && <VotingComponent {...this.props} />}

      </Card>
    );
  }
}

class VotingComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      contractLoaded: false
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

    if (this.props.votingContractType == 'authenticated') {
      this._update.bind(this)(authenticatedBallot.abi, true);
    }
    else if (this.props.votingContractType == 'unauthenticated') {
      this._update.bind(this)(ballot.abi, true);
    }
  }
  _update(abi, initialising) {
    Ballot = new web3.eth.Contract(abi, this.props.contractAddress);
    Ballot.methods
      .regex()
      .call()
      .then(result => {
        console.log('regex', result);
        this.setState({
          regex: result,
          options: result.split("_=_").filter((el, ind) => ind !== 0),
          question: result.split("_=_")[0]
        });
      })
      .then(() => {
        Ballot.methods
          .options()
          .call()
          .then(result => {
            console.log('options', result);
            this.setState({ optionCount: result });
            if (this.state.optionCount != this.state.options.length)
              alert("BLOCK IS INFECTED");
          });
      })
      .then(() => {
        this.setState({ result: [] })
        this.state.options.map((option, index) => {
          Ballot.methods
            .result(index + 1)
            .call()
            .then(res => {
              console.log('result', index, res);
              this.setState({
                result: [...this.state.result, res]
              });
            });
        });
        Ballot.methods
          .voted(web3.givenProvider.selectedAddress)
          .call()
          .then(res => {
            console.log('voted', res)
            this.setState({
              voted: res
            });
          });
      })
      .then(() => {
        if (this.props.votingContractType == 'authenticated') {
          Ballot.methods
            .getData(web3.givenProvider.selectedAddress)
            .call()
            .then(res => {
              console.log(res, res.length == 0, 'res');
              if (res.length == 0) {
                this.setState({
                  notRegistered: true
                })
              }
            });
        }
      })
      .then(() => {
        setTimeout(() => {
          this.setState({ contractLoaded: true });
        }, 200);
      });
    if (initialising)
      Ballot.events
        .addVote({}, (error, event) => { })
        .on("data", event => {
          console.log(event.returnValues);
          this.setState({
            result: this.state.result.map((res, index) => {
              if (index + 1 == event.returnValues._choice)
                return parseInt(res) + 1;
              return res;
            })
          });
        })
        .on("changed", event => {
          // remove event from local database
        })
        .on("error", console.error);
  }

  doVote(option) {
    accountaddress = web3.givenProvider.selectedAddress;
    var mygas;
    Ballot.methods
      .vote(option)
      .estimateGas({ from: accountaddress })
      .then(function (gasAmount) {
        mygas = gasAmount;
      });
    Ballot.methods
      .vote(option)
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
        if (this.props.votingContractType == 'authenticated')
          this._update.bind(this)(authenticatedBallot.abi, false);
        else
          this._update.bind(this)(ballot.abi, false);
      });
  }

  render() {
    if (!this.state.contractLoaded) {
      return (
        <CircularProgress />
      );
    }
    var sum = 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
        <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>{this.props.contractAddress}<br />{this.state.question}</Typography>
        <Grid style={{
          boxShadow: "0.5px 1.5px 1.5px 1.5px #888888",
          borderRadius: 50,
          padding: "50px 0px 50px 0px",
          margin: 20,
          backgroundColor: '#f5d3d0',
          width: "100%"
        }}>
          {this.state.options && this.state.options.map((option, index) => {
            sum = sum + parseInt(this.state.result[index]);
            console.log('result', this.state.result[index]);
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: "10px 10px 10px 0px",
              }}>
                <div style={{
                  display: 'flex',
                  borderRadius: "0px 50px 50px 0px",
                  boxShadow: "1.5px 1.5px 1.5px .5px #888888",
                  padding: 5,
                  backgroundColor: (this.state.voted != index + 1 ? 'white' : 'mediumseagreen'),
                  width: "80%",
                  justifyContent: 'flex-start'
                }}>
                  <Typography variant="body1" style={{ fontFamily: 'Roboto Mono', marginLeft: 20, marginRight: 10, verticalAlign: 'middle', lineHeight: 2.5, fontWeight: 'bold' }}>
                    <VolumeUpIcon style={{ verticalAlign: 'middle', marginLeft: 10, marginRight: 10 }} />
                    {option}
                  </Typography>
                </div>
                {/* <Tooltip title={() => {
                  if (this.state.voted != 0)
                    return 'Already Voted';
                  else if (this.state.notRegistered)
                    return 'Not Subscribed as a voter';
                  else return 'Vote';
                }}> */}
                <Tooltip title={
                  this.state.voted != 0 ?
                    'Already Voted' : 'Vote'
                }>
                  <Button
                    onClick={() => { this.doVote(index + 1); console.log(index + 1, 'vote vote') }}
                    disabled={this.state.voted != 0 || this.state.notRegistered ? true : false}
                    color="primary"
                    variant="contained"
                    style={{
                      borderRadius: 50,
                      border: 'solid',
                      margin: "8px 20px 8px 20px",
                      borderStyle: 'inset',
                      width: 120
                    }}
                  >
                    {this.state.voted != 0 ? this.state.result[index] + " Vote" : ''}
                  </Button>
                </Tooltip>

              </div>
            );
          })}
        </Grid>
        {this.state.voted != 0 && <Typography style={{ fontWeight: 'bold' }}>{sum} VOTES CASTED</Typography>}
        {this.state.notRegistered ? <Link to={{
          pathname: '/registration',
          state: {
            publicDBAddress: 0x0000
          }
        }}>Register Yourself First.</Link> : <div />}
      </div>
    );
  }
}