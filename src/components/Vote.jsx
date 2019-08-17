/* eslint-disable no-loop-func */
import React from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import ballot from "../contractsJSON/publicPoll";
import authenticatedBallot from "../contractsJSON/authenticatedPoll";
import TextField from "@material-ui/core/TextField";
import { Tooltip, Typography, Grid, Select, Divider, withStyles, LinearProgress } from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp"
const Web3 = require("web3");
var web3 = new Web3();
var accountaddress;
var Ballot;
var apiResponse = {};


const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#b2dfdb',
  },
  barColorPrimary: {
    backgroundColor: '#00695c',
  },
})(LinearProgress);


export default class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: 0,
      contractLoaded: false,
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
      var provider = new Web3.providers.HttpProvider("https://wevote.blockchain.azure.com:3200/Zr6vQionvLVeneyF9fIkQZwA");
      web3 = new Web3(provider);
      // alert("You have to install MetaMask extension for your browser !");
      web3.eth.personal.getAccounts().then(res => {
        this.setState({ mobile: true });
        accountaddress = res[1];
      })
    }
  }

  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    return (
      <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.8)', maxWidth: '60vw' }} className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
        <br />
        {!this.props.contractAddress && (
          <form onSubmit={(e) => {
            e.preventDefault();
            this.props._handleContractAddress({ "contractAddress": this.state.inputAddress, "votingContractType": this.state.votingContractType });
          }}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs={12} style={{ width: "100%" }}>
                <TextField
                  id="inputAddress"
                  variant="outlined"
                  value={this.state.inputAddress}
                  onChange={this._handleChange.bind(this)}
                  autoComplete="off"
                  fullWidth
                  placeholder='Database Contract Address'
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
              </Grid>
              <Grid item xs={12} md={6}>
                <Button style={{ borderRadius: 50, margin: 10 }}
                  type="submit"
                  color="primary"
                  variant="contained"
                >
                  Load Voting Ballot
            </Button>
              </Grid>
            </Grid>
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
      loading: 0,
      contractLoaded: false,
      update: 0
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
      var provider = new Web3.providers.HttpProvider("https://wevote.blockchain.azure.com:3200/Zr6vQionvLVeneyF9fIkQZwA");
      web3 = new Web3(provider);
      // alert("You have to install MetaMask extension for your browser !");
      web3.eth.personal.getAccounts().then(res => {
        this.setState({ mobile: true });
        accountaddress = res[1];
      });
    }

    if (this.props.votingContractType == 'authenticated') {
      this._update.bind(this)(authenticatedBallot.abi, true);
    }
    else {
      this._update.bind(this)(ballot.abi, true);
    }

    var timer = setInterval(() => {
      this.setState({
        loading: this.state.loading + 2
      });
    }, 100);

    setTimeout(() => {
      this.setState({ contractLoaded: true })
      clearInterval(timer);
      console.log(this.state, 'state')
      console.log('response', apiResponse)
      this.setState({ loading: 100 });
    }, 5000);
  }
  _update(abi, initialising) {
    console.log('here');
    var account = accountaddress;
    if (!this.state.mobile) {
      account = web3.givenProvider.selectedAddress;
    }
    else {
      alert(account);
    }
    Ballot = new web3.eth.Contract(abi, this.props.contractAddress);
    Ballot.methods
      .regex()
      .call()
      .then(result => {
        console.log('regex', result);
        apiResponse["regex"] = result;
        apiResponse["options"] = result.split("_=_").filter((el, ind) => ind !== 0);
        apiResponse["question"] = result.split("_=_")[0];
        apiResponse["result"] = [];
        result.split("_=_").filter((el, ind) => ind !== 0).map((option, index) => {
          Ballot.methods
            .result(index + 1)
            .call()
            .then(res => {
              console.log('vote result', index + 1, res);
              apiResponse.result[index] = parseInt(res);
            });
        });
      })
    Ballot.methods
      .options()
      .call()
      .then(result => {
        console.log('options', result);
        apiResponse.optionCount = result;
      })
    Ballot.methods
      .voted(account)
      .call()
      .then(res => {
        console.log('voted', res);
        apiResponse.voted = res;
      });
    apiResponse.votersVoted = [];
    Ballot.methods
      .totalVoters()
      .call()
      .then(res => {
        for (var i = 0; i < res; i++) {
          Ballot.methods
            .votersVoted(i)
            .call()
            .then(result => {
              apiResponse.votersVoted.push(result);
            });
        }
      })
    if (this.props.votingContractType == 'authenticated') {
      Ballot.methods
        .getData(account)
        .call()
        .then(res => {
          console.log(res, 'res');
          if (res == false) {
            apiResponse.notRegistered = true;
          }
          else {
            apiResponse.notRegistered = false;
          }
        });
      Ballot.methods
        .dbAddr()
        .call()
        .then(res => {
          console.log(res, 'dbAddr');
          apiResponse.dbAddr = res;
        });
    }
    if (initialising)
      Ballot.events
        .addVote({}, (error, event) => { })
        .on("data", event => {
          console.log(event.returnValues);
          apiResponse.votersVoted.push(event.returnValues.sender);
          apiResponse.result[event.returnValues._choice - 1] += 1;
          setTimeout(() => {
            this.setState({ update: this.state.update + 1 })
          }, 50);
          // this.setState({
          //   result: this.state.result.map((res, index) => {
          //     if (index + 1 == event.returnValues._choice)
          //       return parseInt(res) + 1;
          //     return res;
          //   }),
          //   votersVoted: [...this.state.votersVoted, event.returnValues.sender]
          // });
        })
        .on("changed", event => {
          // remove event from local database
        })
        .on("error", console.error);
  }

  doVote(option) {
    var account = accountaddress;
    if (!this.state.mobile) {
      account = web3.givenProvider.selectedAddress;
    }
    else {
      alert(account);
    }
    var mygas;
    Ballot.methods
      .vote(option)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        mygas = gasAmount;
      });
    Ballot.methods
      .vote(option)
      .send({
        from: account,
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
        apiResponse.voted = option;
        setTimeout(() => {
          this.setState({ update: this.state.update + 1 })
        }, 50);
      })
      .on("error", error => alert(error.message));
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to='/database' />
      )
    }
    var sum = 0;
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item style={{ maxWidth: '100%', overflow: 'auto' }} >
          <Typography variant="h6" align="center" style={{ fontFamily: "DM Serif Text", margin: 10, overflow: '' }}>Voting Contract<br />{this.props.contractAddress}
          </Typography>
        </Grid>
        {this.state.contractLoaded ?
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
            <Divider style={{ margin: 5, height: 5, width: '80%' }} />
            <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", margin: 20 }}>{apiResponse.question}</Typography>
            <Grid style={{
              boxShadow: "0.5px 1.5px 1.5px 1.5px #888888",
              borderRadius: 50,
              padding: "50px 0px 50px 0px",
              margin: 20,
              backgroundColor: '#f5d3d0',
              width: "100%"
            }}>
              {apiResponse.options && apiResponse.options.map((option, index) => {
                sum = parseInt(sum) + parseInt(apiResponse.result[index]);
                console.log('result index', index, apiResponse.result[index]);
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
                      backgroundColor: (apiResponse.voted != index + 1 ? 'white' : 'mediumseagreen'),
                      width: "80%",
                      justifyContent: 'flex-start'
                    }}>
                      <Typography variant="body1" style={{ fontFamily: 'Roboto Mono', marginLeft: 20, marginRight: 10, verticalAlign: 'middle', lineHeight: 2.5, fontWeight: 'bold' }}>
                        <VolumeUpIcon style={{ verticalAlign: 'middle', marginLeft: 10, marginRight: 10 }} />
                        {option}
                      </Typography>
                    </div>
                    {/* <Tooltip title={() => {
                  if (apiResponse.voted != 0)
                    return 'Already Voted';
                  else if (apiResponse.notRegistered)
                    return 'Not Subscribed as a voter';
                  else return 'Vote';
                }}> */}
                    <Tooltip title={
                      apiResponse.voted != 0 ?
                        'Already Voted' : 'Vote'
                    }>
                      <Button
                        onClick={() => { this.doVote(index + 1); console.log(index + 1, 'vote vote') }}
                        disabled={apiResponse.voted != 0 || apiResponse.notRegistered ? true : false}
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
                        {apiResponse.voted != 0 ? apiResponse.result[index] + " Vote" : ''}
                      </Button>
                    </Tooltip>

                  </div>
                );
              })}
            </Grid>
            {apiResponse.notRegistered ? <Button style={{ borderRadius: 50, margin: 10 }} onClick={() => { this.props._handleContractAddress({ dbContractAddress: apiResponse.dbAddr }); this.setState({ redirect: true }) }} variant="contained" color="secondary">Register To Vote</Button> : <div />}
            {/* {apiResponse.votersVoted && <div>
            {apiResponse.votersVoted.map((voter) => {
              return (
                <Typography style={{ fontWeight: 'bold', margin: 20 }}>{voter}</Typography>
              )
            })}
          </div>} */}
          </div> :
          <Grid item style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline', width: '100%'
          }}>
            <ColorLinearProgress variant="determinate" style={{ margin: "0px 30px 20px 30px", width: '80%' }} value={Math.min(this.state.loading, 100)} />
            <Typography variant="subtitle2" style={{ fontFamily: 'DM Serif Text' }}>{Math.min(this.state.loading, 100)}%</Typography>
          </Grid>
        }
      </Grid>
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
      var provider = new Web3.providers.HttpProvider("https://wevote.blockchain.azure.com:3200/Zr6vQionvLVeneyF9fIkQZwA");
      web3 = new Web3(provider);
      // alert("You have to install MetaMask extension for your browser !");
      web3.eth.personal.getAccounts().then(res => {
        this.setState({ mobile: true });
        accountaddress = res[1];
      });
    }

    this._update.bind(this)(ballot.abi, true);
  }
  _update(abi, initialising) {
    console.log('here');
    var account = accountaddress;
    if (!this.state.mobile) {
      account = web3.givenProvider.selectedAddress;
    }
    else {
      alert(account);
    }
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
          .voted(account)
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
    console.log('here');
    var account = accountaddress;
    if (!this.state.mobile) {
      account = web3.givenProvider.selectedAddress;
    }
    else {
      alert(account);
    }
    var mygas;
    Ballot.methods
      .vote(option)
      .estimateGas({ from: account })
      .then(function (gasAmount) {
        mygas = gasAmount;
      });
    Ballot.methods
      .vote(option)
      .send({
        from: account,
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
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <Grid item style={{ maxWidth: '100%', overflow: 'auto' }} >
          <Typography variant="h6" align="center" style={{ fontFamily: "DM Serif Text", margin: 10, overflow: '' }}>
            Petition Contract<br />{this.props.contractAddress}
          </Typography>
        </Grid>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
          <Divider style={{ margin: 5, height: 5, width: '80%' }} />
          <div style={{ margin: 20 }}>
            <Typography variant="h6" align="center" style={{ fontFamily: "Roboto Mono", fontWeight: 'bold' }}>{this.state.title}</Typography>
            <Typography variant="body1" align="center" style={{ fontFamily: "Roboto Mono" }}>{this.state.body}</Typography>
          </div>
          <Button style={{ borderRadius: 50, margin: 10 }}
            onClick={() => { this.doVote(1) }}
            disabled={this.state.voted != 0 ? true : false}
            color="primary"
            variant="contained"
          >
            Sign Petition
        </Button>
          <Divider style={{ margin: 5, height: 5, width: '80%' }} />
          <Typography style={{ fontWeight: 'bold',margin: 10, fontFamily: 'DM Serif Text' }}>{this.state.result} Signed </Typography>
          {this.state.votersVoted && <div>
            {this.state.votersVoted.map((voter) => {
              return (
                <Typography style={{ fontFamil: 'DM Serif Text', margin: 5 }}>{voter}</Typography>
              )
            })}
          </div>}
        </div>
      </Grid>
    );
  }
}