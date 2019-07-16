import React from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Typography,
  Card,
  Button,
  CircularProgress,
  Grid,
  Fab,
  Tooltip
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ballot from "../contracts/poll";

const Web3 = require("web3");
var web3 = new Web3();
var ballotContract;
var accountaddress;
var contractAddress;
var transactionHash;
var Ballot;

export default class CreateBallot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: "Weather is nice today, isn't it?",
      optionCount: 2,
      options: ["Yes", "No"],
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleClick = this._handleClick.bind(this);
    this._handleOptionChange = this._handleOptionChange.bind(this);
    this.addTextField = this.addTextField.bind(this);
    this._deleteOption = this._deleteOption.bind(this);
    this.ballotCard = this.ballotCard.bind(this);
  }
  componentDidMount() {
    console.log(ballot);
    // Modern DApp Browsers
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function() {
          // User has allowed account access to DApp...
          accountaddress = web3.givenProvider.selectedAddress;
          ballotContract = new web3.eth.Contract(ballot.abi);
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
  _handleClick(event) {
    event.preventDefault();
    this.setState({ loading: 1 });
    contractAddress = undefined;
    transactionHash = undefined;

    var exp = [this.state.question, ...this.state.options].join("_=_");
    var que = this.state.optionCount;
    console.log(exp);
    ballotContract
      .deploy({
        data: ballot.bytecode,
        arguments: [exp, que]
      })
      .send(
        {
          from: web3.givenProvider.selectedAddress,
          gas: 1308700,
          gasPrice: web3.eth.gasPrice,
          gasLimit: 2000000
        },
        (error, Hash) => {}
      )
      .on("error", error => {
        console.log(error);
        alert("Transaction rejected");
        this.setState({ loading: 0 });
      })
      .on("transactionHash", Hash => {
        console.log(Hash);
        transactionHash = Hash;
        this.setState({ loading: 2 });
      })
      .on("receipt", receipt => {
        contractAddress = receipt.contractAddress;
        console.log(contractAddress);
        this.setState({ loading: 3 });
        this.props._handleContractAddress(contractAddress);
      });
  }

  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }
  _handleOptionChange(event) {
    var list = this.state.options.map((option, index) => {
      if (index == event.target.id) return event.target.value;
      return option;
    });
    this.setState({
      options: list
    });
  }
  _deleteOption(id) {
    if (this.state.optionCount === 2) return;
    this.setState(state => ({
      options: state.options.filter((el, ind) => ind != id),
      optionCount: state.optionCount - 1
    }));
  }
  addTextField() {
    if (this.state.optionCount === 5) return;
    this.setState({
      options: [...this.state.options, ""],
      optionCount: this.state.optionCount + 1
    });
  }
  ballotCard() {
    return (
      <Card className="card">
        {transactionHash && (
          <div>
            <Typography>
              <strong>Transaction Hash :</strong> <br /> {transactionHash}
              <Tooltip title="Copy to Clipboard">
                <AssignmentIcon
                  onClick={() => {
                    navigator.clipboard.writeText(transactionHash);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </Typography>
          </div>
        )}
        {contractAddress && (
          <div style={{ margin: "1rem" }}>
            <Typography>
              <strong>Contract Address :</strong> <br /> {contractAddress}
              <Tooltip title="Copy to Clipboard">
                <AssignmentIcon
                  onClick={() => {
                    navigator.clipboard.writeText(contractAddress);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </Typography>
          </div>
        )}
        {this.state.loading !== 3 ? (
          <CircularProgress />
        ) : (
          <div style={{ marginTop: "2rem" }}>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6}>
                <Link to="/vote" style={{ textDecoration: "none" }}>
                  <Fab size="small" color="secondary" variant="extended">
                    Load Contract
                  </Fab>
                </Link>
              </Grid>
              <Grid item xs={6} className="submit">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    this.setState({ loading: 0 });
                  }}
                >
                  New Contract
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </Card>
    );
  }

  render() {
    return (
      <Card className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
        {this.state.loading && !this.state.contractLoaded ? (
          this.ballotCard()
        ) : (
          <form onSubmit={this._handleClick}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <div class="question-input-root">
                  <textarea
                    className="question-input"
                    id="question"
                    label="Question"
                    onChange={this._handleChange}
                    value={this.state.question}
                    required
                    fullWidth
                    placeholder="Your Question ..."
                    autoComplete="off"
                    autoFocus
                  />
                </div>
              </Grid>
              {this.state.options.map((option, index) => {
                return (
                  <Grid item>
                    <div class="input-root">
                      <input
                        className="option-input"
                        id={index}
                        label={"Choice"}
                        onChange={this._handleOptionChange}
                        value={this.state.options[index]}
                        required
                        autoComplete="off"
                        placeholder="Option"
                      />
                      <Tooltip title="Delete Option">
                        <IconButton
                          onClick={() => this._deleteOption(index)}
                          disabled={this.state.optionCount === 2 ? true : false}
                          visible="false"
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </Grid>
                );
              })}
              <div style={{ marginTop: "2rem", width: "100%" }}>
                <Grid item container direction="row" spacing={6}>
                  <Grid item xs={4}>
                    <Tooltip title="Add Option">
                      <Fab
                        size="small"
                        onClick={this.addTextField}
                        color="secondary"
                        disabled={this.state.optionCount === 5 ? true : false}
                      >
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={8} className="submit">
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      disabled={this.state.loading ? true : false}
                    >
                      Create Poll
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </form>
        )}
      </Card>
    );
  }
}
