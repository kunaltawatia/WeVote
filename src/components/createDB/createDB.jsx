import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import {
  IconButton,
  Input,
  Typography,
  Card,
  Button,
  CircularProgress,
  Grid,
  Fab,
  Tooltip,
  TextField
} from "@material-ui/core";
import db from "../../contractsJSON/publicDB";

const Web3 = require("web3");
var web3 = new Web3();
var accountaddress, dbContract, contractAddress;

export default class CreateBallot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };
    this._handleChange = this._handleChange.bind(this);
    this._handleClick = this._handleClick.bind(this);
  }
  componentDidMount() {
    // Modern DApp Browsers
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        window.ethereum.enable().then(function () {
          // User has allowed account access to DApp...
          accountaddress = web3.givenProvider.selectedAddress;
          dbContract = new web3.eth.Contract(db.abi);
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
    var details = this.state.name, transactionHash;
    dbContract
      .deploy({
        data: db.bytecode,
        arguments: [details]
      })
      .send(
        {
          from: web3.givenProvider.selectedAddress,
          gas: 1308700,
          gasPrice: web3.eth.gasPrice,
          gasLimit: 2000000
        },
        (error, Hash) => { }
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
      });
  }

  _handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  render() {
    if (this.state.redirect) {
      return (
        <Redirect to="/vote" />
      )
    }
    if (contractAddress) {
      return (
        <Card className="card">
          <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
          <DBCard />
        </Card>
      )
    }
    return (
      <Card className="card">
        <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
        <form onSubmit={this._handleClick}>
          <TextField id="name" value={this.state.name} label="Database Owner" type="outlined" onChange={this._handleChange} fullWidth />
          <div style={{
            textAlign: 'right',
            margin: 10,
            bottom: 0
          }}>
            <Button color="secondary" type="submit">Create Database</Button>
          </div>
        </form>
      </Card>
    );
  }
}
class DBCard extends Component {
  state={owner:''}
  componentDidMount(){
    dbContract = new web3.eth.Contract(db.abi,contractAddress);
    dbContract.methods.owner().call().then((res)=>{
      this.setState({owner:res});
    })
  }
  render() {
    return (
      <p>{contractAddress}</p>
    )
  }
}