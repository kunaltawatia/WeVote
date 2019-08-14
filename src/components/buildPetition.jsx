import React from "react";
import { Link, Redirect } from "react-router-dom";
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
import ballot from "../contractsJSON/publicPoll";
import authenticatedBallot from "../contractsJSON/authenticatedPoll";

const Web3 = require("web3");
var web3 = new Web3();
var ballotContract, authenticatedBallotContract;
var accountaddress;
var contractAddress;
var transactionHash;
var Ballot, exp, que;

export default class CreateBallot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            petitionTitle: '',
            petitionBody: '',
            optionCount: 1,
            addVoterAuthentication: true
        };
        this._handleChange = this._handleChange.bind(this);
        this._handleClick = this._handleClick.bind(this);
        this.ballotCard = this.ballotCard.bind(this);
    }
    componentDidMount() {
        console.log(ballot);
        // Modern DApp Browsers
        if (window.ethereum) {
            web3 = new Web3(window.ethereum);
            try {
                window.ethereum.enable().then(function () {
                    // User has allowed account access to DApp...
                    accountaddress = web3.givenProvider.selectedAddress;
                    ballotContract = new web3.eth.Contract(ballot.abi);
                    authenticatedBallotContract = new web3.eth.Contract(authenticatedBallot.abi);
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
        exp = [this.state.petitionTitle, this.state.petitionBody].join("_=_");
        que = this.state.optionCount;
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
                this.props._handleContractAddress({ "contractAddress": contractAddress, "votingContractType": 'petition' });
            });
    }

    _handleChange(event) {
        this.setState({ [event.target.id]: event.target.value });
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
                                    <Button  style={{borderRadius:50,margin:10}} 
                                        color="primary"
                                        variant="contained"
                                        onClick={() => {
                                            this.setState({ loading: 0 });
                                            contractAddress = undefined;
                                            transactionHash = undefined;
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
        if (this.state.redirect) {
            return (
                <Redirect to="/createDatabase" />
            )
        }
        return (
            <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.6)', maxWidth: '60vw' }} className="card">
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
                                            className="title-input"
                                            style={{ resize: "none" }}
                                            id="petitionTitle"
                                            label="Petition Title"
                                            onChange={this._handleChange}
                                            value={this.state.petitionTitle}
                                            required
                                            fullWidth
                                            placeholder="Petition Title"
                                            autoComplete="off"
                                            autoFocus
                                            spellcheck="false"
                                        />
                                    </div>
                                </Grid>
                                <Grid item>
                                    <div class="question-input-root">
                                        <textarea
                                            className="body-input"
                                            style={{ resize: "none" }}
                                            id="petitionBody"
                                            label="Petition Body"
                                            onChange={this._handleChange}
                                            value={this.state.petitionBody}
                                            required
                                            fullWidth
                                            placeholder="Petition Body"
                                            autoComplete="off"
                                            autoFocus
                                            spellcheck="false"
                                        />
                                    </div>
                                </Grid>
                                <div style={{ marginTop: "2rem", width: "100%" }}>
                                    <Grid item container direction="row" spacing={6}>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>

                                            <Button  style={{borderRadius:50,margin:10}} 
                                                color="primary"
                                                variant="contained"
                                                type="submit"
                                                disabled={this.state.loading ? true : false}
                                            >
                                                Build Petition
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
