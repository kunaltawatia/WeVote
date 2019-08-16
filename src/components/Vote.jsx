import React from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import ballot from "../contractsJSON/publicPoll";
import authenticatedBallot from "../contractsJSON/authenticatedPoll";
import TextField from "@material-ui/core/TextField";
import { Tooltip, Typography, Grid, Select, MenuItem, Menu } from "@material-ui/core";
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
      <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.6)', maxWidth: '60vw', padding: 50 }} className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
        <br />
        {!this.props.contractAddress && (
          <form onSubmit={(e) => {
            e.preventDefault();
            this.props._handleContractAddress({ "contractAddress": this.state.inputAddress, "votingContractType": this.state.votingContractType });
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                <option value="petition">Petition</option>
              </Select>
              <Button style={{borderRadius:50,margin:10}} 
                type="submit"
                color="primary"
                variant="contained"
              >
                Load Voting Ballot
            </Button>
            </div>
          </form>
        )}

        {this.props.contractAddress && this.props.votingContractType != 'petition' && <VotingComponent {...this.props} />}
        {this.props.votingContractType == 'petition' && <PetitionComponent {...this.props} />}

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
        this.setState({ votersVoted: [] });
        Ballot.methods
          .totalVoters()
          .call()
          .then(res => {
            for (var i = 0; i < res; i++) {
              Ballot.methods
                .votersVoted(i)
                .call()
                .then(result => {
                  this.setState({
                    votersVoted: [...this.state.votersVoted, result]
                  });
                });
            }
          });
      })
      .then(() => {
        if (this.props.votingContractType == 'authenticated') {
          Ballot.methods
            .getData(web3.givenProvider.selectedAddress)
            .call()
            .then(res => {
              console.log(res, 'res');
              if (res == false) {
                this.setState({
                  notRegistered: true
                })
              }
            });
          Ballot.methods
            .dbAddr()
            .call()
            .then(res => {
              console.log(res, 'dbAddr');
              this.setState({
                dbAddr: res
              })
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
            }),
            votersVoted: [...this.state.votersVoted, event.returnValues.sender]
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
    if (this.state.redirect) {
      return (
        <Redirect to='/database' />
      )
    }
    var sum = 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
        <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>{this.state.question}</Typography>
        <Grid style={{
          boxShadow: "0.5px 1.5px 1.5px 1.5px #888888",
          borderRadius: 50,
          padding: "50px 0px 50px 0px",
          margin: 20,
          backgroundColor: '#f5d3d0',
          width: "100%"
        }}>
          {this.state.options && this.state.options.map((option, index) => {
            sum = parseInt(sum) + parseInt(this.state.result[index]);
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
        {this.state.notRegistered ? <Button style={{borderRadius:50,margin:10}} onClick={() => { this.props._handleContractAddress({ dbContractAddress: this.state.dbAddr }); this.setState({ redirect: true }) }} variant="contained" color="secondary">Register To Vote</Button> : <div />}
        <Card style={{ borderRadius: 50 }} className="card">
        <Typography style={{ margin: 20,fontFamily:'DM Serif Text' }}>Ballot Contract:<br/>{this.props.contractAddress}<br />{this.state.result} Votes Casted</Typography>
          {/* {this.state.votersVoted && <div>
            {this.state.votersVoted.map((voter) => {
              return (
                <Typography style={{ fontWeight: 'bold', margin: 20 }}>{voter}</Typography>
              )
            })}
          </div>} */}
        </Card>
      </div>
    );
  }
}

class PetitionComponent extends React.Component {
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

    this._update.bind(this)(ballot.abi, true);
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
          body: result.split("_=_").filter((el, ind) => ind !== 0),
          title: result.split("_=_")[0]
        });
      })
      .then(() => {
        Ballot.methods
          .options()
          .call()
          .then(result => {
            console.log('options', result);
            this.setState({ optionCount: result });
            if (this.state.optionCount != 1)
              alert("BLOCK IS INFECTED");
          });
      })
      .then(() => {
        this.setState({ result: [] })
        Ballot.methods
          .result(1)
          .call()
          .then(res => {
            this.setState({
              result: [...this.state.result, res]
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
        Ballot.methods
          .voted(web3.givenProvider.selectedAddress)
          .call()
          .then(res => {
            console.log('voted', res)
            this.setState({
              voted: res
            });
          });
        this.setState({ votersVoted: [] });
        Ballot.methods
          .totalVoters()
          .call()
          .then(res => {
            for (var i = 0; i < res; i++) {
              Ballot.methods
                .votersVoted(i)
                .call()
                .then(result => {
                  this.setState({
                    votersVoted: [...this.state.votersVoted, result]
                  });
                });
            }
          });
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
            result: parseInt(this.state.result) + 1,
            votersVoted: [...this.state.votersVoted, event.returnValues.sender]
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
        this._update.bind(this)(ballot.abi, false)
      });
  }

  render() {
    if (!this.state.contractLoaded) {
      return (
        <CircularProgress />
      );
    }
    if (this.state.redirect) {
      return (
        <Redirect to='/database' />
      )
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
        <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20, fontWeight: 'bold' }}>{this.state.title}</Typography>
        <Typography variant="body1" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>{this.state.body}</Typography>
        <Button style={{borderRadius:50,margin:10}} 
          onClick={() => { this.doVote(1) }}
          disabled={this.state.voted != 0 ? true : false}
          color="primary"
          variant="contained"
        >
          Sign Petition
        </Button>
        <Card style={{ borderRadius: 50 }} className="card">
          <Typography style={{  margin: 20,fontFamily:'DM Serif Text' }}>Ballot Contract:<br/>{this.props.contractAddress}<br />{this.state.result} signed this petition</Typography>
          {/* {this.state.votersVoted && <div>
            {this.state.votersVoted.map((voter) => {
              return (
                <Typography style={{ fontWeight: 'bold', margin: 20 }}>{voter}</Typography>
              )
            })}
          </div>} */}
        </Card>
      </div>
    );
  }
}