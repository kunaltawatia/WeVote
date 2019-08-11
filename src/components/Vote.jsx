import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import ballot from "../contracts/poll";
import TextField from "@material-ui/core/TextField";
import { Badge, CardHeader, Tooltip, Typography, Grid } from "@material-ui/core";
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
      voted: false,
      inputAddress: '0xBAF82a009E36E6c2F837634889C98Fe47062f3e0'
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
      <Card style={{ borderRadius: 50 }} className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />

        {!this.props.contractAddress && (
          <div>
            <TextField
              id="inputAddress"
              value={this.state.inputAddress}
              onChange={this._handleChange.bind(this)}
              autoComplete="off"
            />
            <Button
              onClick={() => {
                this.props._handleContractAddress(this.state.inputAddress);
              }}
            >
              Load
            </Button>
          </div>
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
      result: []
    }
  }
  componentDidMount() {
    this._update.bind(this)();
  }
  _update() {
    Ballot = new web3.eth.Contract(ballot.abi, this.props.contractAddress);

    Ballot.methods
      .regex()
      .call()
      .then(result => {
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
            this.setState({ optionCount: result });
            if (this.state.optionCount != this.state.options.length)
              alert("BLOCK IS INFECTED");
          });
      })
      .then(() => {
        this.state.options.map((option, index) => {
          Ballot.methods
            .result(index + 1)
            .call()
            .then(res => {
              this.setState({
                result: [...this.state.result, res]
              });
            });
        });
        Ballot.methods
          .voted(web3.givenProvider.selectedAddress)
          .call()
          .then(res => {
            this.setState({
              voted: res
            });
          });
      })
      .then(() => {
        this.setState({ contractLoaded: true });
      });

    Ballot.events
      .addVote({}, (error, event) => { })
      .on("data", event => {
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
        this._update();
      });
  }

  render() {
    if (!this.state.contractLoaded) {
      return (
        <CircularProgress />
      );
    }
    var sum=0;
    return (
      <div>
        <Typography variant="h5" align="center" style={{ fontFamily: "Roboto Mono" }}>{this.state.question}</Typography>
        <Grid style={{
          boxShadow: "0.5px 1.5px 1.5px 1.5px #888888",
          borderRadius: 50,
          padding: "50px 0px 50px 0px",
          margin: 20,
          backgroundColor: '#f5d3d0',
        }}>
          {this.state.options.map((option, index) => {
            sum = sum+parseInt(this.state.result[index]);
            return (
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: "10px 10px 10px 0px"
              }}>
                <div style={{
                  display: 'flex',
                  borderRadius: "0px 50px 50px 0px",
                  boxShadow: "1.5px 1.5px 1.5px .5px #888888",
                  padding: 5,
                  backgroundColor: 'white',
                  width: "80%",
                  justifyContent: 'flex-start'
                }}>
                  <Typography variant="body1" style={{ fontFamily: 'Roboto Mono', marginLeft: 20, verticalAlign: 'middle', lineHeight: 3.5, fontWeight: 'bold' }}>
                    <VolumeUpIcon style={{ verticalAlign: 'middle', marginLeft: 10, marginRight: 10 }} />
                    {option}
                  </Typography>
                </div>
                <Button
                  onClick={() => this.doVote(index + 1)}
                  disabled={this.state.voted ? true : false}
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
                {this.state.voted?this.state.result[index]+" Vote":''}
                </Button>
                {/* </div> */}
              </div>
            );
          })}
        </Grid>
        {this.state.voted && <Typography style={{fontWeight:'bold'}}>{sum} VOTES CASTED</Typography>}
      </div>
    );
  }
}