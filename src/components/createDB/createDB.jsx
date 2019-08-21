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
import AssignmentIcon from "@material-ui/icons/Assignment"
import db from "../../contractsJSON/publicDB";

const Web3 = require("web3");
var web3 = new Web3();
var accountaddress, dbContract, transactionHash, contractAddress;

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
            var provider = new Web3.providers.HttpProvider("https://wevote.blockchain.azure.com:3200/Zr6vQionvLVeneyF9fIkQZwA");
            web3 = new Web3(provider);
            // alert("You have to install MetaMask extension for your browser !");
            dbContract = new web3.eth.Contract(db.abi);
            web3.eth.personal.getAccounts().then(res => {
                this.setState({ mobile: true });
                accountaddress = res[1];
            })
        }
    }
    _handleClick(event) {
        event.preventDefault();
        var account = accountaddress;
        if (!this.state.mobile) {
            account = web3.givenProvider.selectedAddress;
        }
        else {
            alert(account);
        }
        this.setState({ loading: 1 });
        var details = [this.state.name, this.state.age].join('_=_');
        dbContract
            .deploy({
                data: db.bytecode,
                arguments: [details]
            })
            .send(
                {
                    from: account,
                    gas: 2000000,
                    gasPrice: web3.eth.gasPrice,
                    gasLimit: 6000000
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
                this.props._handleContractAddress({ "dbContractAddress": contractAddress });
            });
    }

    _handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
    }
    dbCard() {
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
                                    <Link to="/database" style={{ textDecoration: "none" }}>
                                        <Fab size="small" color="secondary" variant="extended">
                                            Load Contract
                      </Fab>
                                    </Link>
                                </Grid>
                                <Grid item xs={6} className="submit">
                                    <Button style={{ borderRadius: 50, margin: 10 }}
                                        color="primary"
                                        variant="contained"
                                        onClick={() => {
                                            this.setState({ loading: 0 });
                                            contractAddress = undefined;
                                            transactionHash = undefined;
                                        }}
                                    >
                                        New Database
                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    )}
            </Card>
        );
    }
    render() {
        if (this.state.redirect) {
            return (
                <Redirect to="/vote" />
            )
        }
        if (this.state.loading) {
            return (
                <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.95)', maxWidth: '60vw' }} className="card">
                    <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
                    {this.dbCard()}
                </Card>
            )
        }
        return (
            <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.95)', maxWidth: '60vw' }} className="card">
                <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
                <form onSubmit={this._handleClick}>
                    <TextField style={{ margin: 5, width: "80%" }} required id="name" value={this.state.name} label="Database Owner Name" type="outlined" onChange={this._handleChange} />
                    <TextField style={{ margin: 5, width: "80%" }} required id="age" value={this.state.age} label="Database Owner Age" type="outlined" onChange={this._handleChange} />

                    <div style={{
                        textAlign: 'right',
                        margin: 10,
                        bottom: 0
                    }}>
                        <Button style={{ borderRadius: 50, margin: 10 }} variant="contained" color="secondary" type="submit">Create Database</Button>
                    </div>
                </form>
            </Card>
        );
    }
}