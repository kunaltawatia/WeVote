import React from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import ballot from "../contracts/poll";
import TextField from "@material-ui/core/TextField";
import { Badge, CardHeader, Tooltip } from "@material-ui/core";
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
      voted: false
    };
  }
  componentDidMount() {
    // Modern DApp Browsers
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function() {
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
    this._update.bind(this)();
  }
  _update() {
    setTimeout(() => {
      if (this.props.contractAddress) {
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
          .addVote({}, (error, event) => {})
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
    }, 200);
  }
  doVote(option) {
    accountaddress = web3.givenProvider.selectedAddress;
    var mygas;
    Ballot.methods
      .vote(option)
      .estimateGas({ from: accountaddress })
      .then(function(gasAmount) {
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
  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  render() {
    return (
      <Card className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
        <br />
        {this.props.contractAddress && this.state.contractLoaded === false && (
          <CircularProgress />
        )}
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
                this._update.bind(this)();
              }}
            >
              Load
            </Button>
          </div>
        )}
        {this.state.regex && (
          <div>
            <Card className="card">
              <CardHeader
                title={this.state.question}
                style={{ margin: "1rem" }}
              />
              {this.state.options.map((option, index) => {
                return (
                  <Tooltip title={this.state.voted ? "Already Voted" : "Vote"}>
                    <Badge
                      color="secondary"
                      showZero
                      badgeContent={this.state.result[index]}
                    >
                      <Button
                        onClick={() => this.doVote(index + 1)}
                        disabled={this.state.voted}
                      >
                        {option}
                      </Button>
                    </Badge>
                  </Tooltip>
                );
              })}
            </Card>
          </div>
        )}
      </Card>
    );
  }
}
