import React, { Component } from 'react';
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

export class Confirm extends Component {
  continue = e => {
    e.preventDefault();
    // PROCESS FORM //
    this.props.nextStep();
  };

  back = e => {
    e.preventDefault();
    this.props.prevStep();
  };

  render() {
    const {
      values: { firstName, lastName, email, date_of_birth, constituency, aadhar_number }
    } = this.props;
    return (
      <div>
        
        <React.Fragment>
        <Appbar  style ={{position: "absolute", backgroundColor: '#000033',width:'100%'}}>
              <Toolbar >
               <Typography style ={{ color: 'white'}}>
               Confirm
               </Typography>
             </Toolbar>
            </Appbar>
            
            <p > First Name : {firstName} </p>
            <p > Last Name : {lastName} </p>
            <p > Email : {email} </p>
            <p > Date Of Birth : {date_of_birth} </p>
            <p > Constituency : {constituency} </p>
            <p > Aadhar Number : {aadhar_number} </p>
            
         
          <br />
          <Button variant="contained" color="black"  onClick={this.back} >
                Back
               </Button>
          
          <Button variant="contained" color="black"  onClick={this.continue} >
               Confirm & Continue
       
               <Icon>send</Icon>
               </Button>
               
        </React.Fragment>
      </div>
    );
  }
}


export default Confirm;