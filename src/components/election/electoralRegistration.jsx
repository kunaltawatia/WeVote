import React from 'react';
import Database from '../database/database';
import { Grid, Button, TextField, Card, Divider, Typography } from "@material-ui/core";
import Webcam from 'react-webcam';

export default class ElectoralVoting extends React.Component {
    constructor(props){
        super(props);
        this.state={
            dbContractAddress:''
        }
        this.stateChange = this.stateChange.bind(this);
    }
    stateChange(state){
        this.setState(state);
    }
    render() {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'row-reverse',
                justifyContent: 'space-between'
            }}>
                <div style={{ margin: 10, flex: 1 }}>
                    <Registration />
                </div>
                <div style={{ margin: 10, flex: 1 }}>
                    <Database dbContractAddress={this.state.dbContractAddress} _handleContractAddress={this.stateChange}/>
                </div>
            </div>

        )
    }
}

class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleImage = this._handleImage.bind(this);
    }
    _handleSubmit() {
        var alarmpass = document.getElementById("alarmpass").value;
        var confirmalarmpass = document.getElementById("confirmalarmpass").value;
        var pass = document.getElementById("pass").value;
        var confirmpass = document.getElementById("confirmpass").value;
        var voterAddress = document.getElementById("voterAddress").value;
        var aadharID = document.getElementById("aadharId").value;
        var email = document.getElementById("email").value;
        if (confirmalarmpass !== alarmpass) {
            alert("Confirm Alarm Password should have the same value as of Alarm Password");
        }
        else if (confirmpass !== pass) {
            alert("Confirm Password should have the same value as of Password");
        }
        else if (!this.state.img) {
            alert("Click an Image");
        }
        else {
            fetch("/electoralVoting/register", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ img: this.state.img, voterAddress: voterAddress, aadharID: aadharID, pass: pass, alarmpass: alarmpass, email: email })
            })
        }
    }
    _handleImage(img) {
        this.setState({ img: img });
    }
    render() {
        return (
            <Card style={{ borderRadius: 50, backgroundColor: 'rgb(192,192,192,0.8)', maxWidth: '50vw' }} className="card">
                <img src="/favicon.ico" alt="/favicon.ico" className="logo" />
                <Typography variant="h4" align="center" style={{ fontFamily: "DM Serif Text", margin: 10, overflow: '' }}>Electoral Registration</Typography>
                <Divider style={{ margin: "5px 5px 30px 5px", height: 5 }} />
                <form onSubmit={(e) => {
                    e.preventDefault();
                    this._handleSubmit();
                }}>
                    <Grid
                        container
                        justify="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item xs={12} style={{ width: "100%" }}>
                            <TextField
                                id="aadharId"
                                variant="outlined"
                                autoComplete="off"
                                required
                                fullWidth
                                label='Aadhar ID'
                            />
                        </Grid>
                        <Grid item xs={12} style={{ width: "100%" }}>
                            <TextField
                                id="voterAddress"
                                variant="outlined"
                                autoComplete="off"
                                required
                                fullWidth
                                label='Voter Address'
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                id="pass"
                                variant="outlined"
                                autoComplete="off"
                                required
                                fullWidth
                                type="password"
                                label='Password'
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                id="confirmpass"
                                variant="outlined"
                                autoComplete="off"
                                required
                                fullWidth
                                type="password"
                                label='Confirm Password'
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                id="alarmpass"
                                variant="outlined"
                                autoComplete="off"
                                required
                                fullWidth
                                type="password"
                                label='Alarm Password'
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                                id="confirmalarmpass"
                                variant="outlined"
                                autoComplete="off"
                                required
                                fullWidth
                                type="password"
                                label='Confirm Alarm Password'
                            />
                        </Grid>
                        <Grid item xs={12} style={{ width: "100%" }}>
                            <TextField
                                id="email"
                                variant="outlined"
                                autoComplete="off"
                                required
                                fullWidth
                                type="email"
                                label='E-Mail'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <WebcamCapture _handleImage={this._handleImage} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Button style={{ borderRadius: 50, margin: 10 }}
                                type="submit"
                                color="primary"
                                variant="contained"
                            >
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Card>
        )
    }
}

class WebcamCapture extends React.Component {
    state = {
        image: ''
    }
    setRef = webcam => {
        this.webcam = webcam;
    };

    capture = (e) => {
        e.preventDefault();
        const imageSrc = this.webcam.getScreenshot();
        this.setState({ image: imageSrc });
        this.props._handleImage(imageSrc);
    };

    render() {
        const videoConstraints = {
            width: 1280,
            height: 720,
            facingMode: "user"
        };

        return (
            <div>
                <Grid container spacing={2}>
                    <Grid item xs={this.state.image ? 6 : 12}>
                        <Webcam
                            audio={false}
                            height={350}
                            ref={this.setRef}
                            screenshotFormat="image/jpeg"
                            width={350}
                            videoConstraints={videoConstraints}
                        />
                    </Grid>
                    {this.state.image &&
                        <Grid item xs={6} style={{ alignSelf: 'center' }}>
                            <img src={this.state.image} alt="shot" />
                        </Grid>
                    }
                </Grid>
                <Button
                    style={{ borderRadius: 50, margin: 10 }}
                    color="primary"
                    variant="outlined"
                    onClick={this.capture.bind(this)}
                >
                    Smile and click :)
                </Button>
            </div>
        );
    }
}