import React, { Component } from 'react'

import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Icon from '@material-ui/core/Icon';

export class FormUserDetails extends Component {
    continue = e => {
        e.preventDefault();
        this.props.nextStep();
      };
    
      render() {
        const { values, handleChange } = this.props;
        return (
          <div>
            <React.Fragment>
            <Appbar  style ={{position: "absolute", backgroundColor: '#000033',width:'100%'}}>
              <Toolbar >
               <Typography style ={{ color: 'white'}}>
               Registration
               </Typography>
             </Toolbar>
            </Appbar>
           
           <p> </p>
    
              <TextField  style={{ width:'200px',height:'20px',padding:'10px'}}
                label="Enter Your First Name"
                floatingLabelText="First Name"
                margin="normal"
                variant="outlined"
                onChange={handleChange('firstName')}
                defaultValue={values.firstName}
              />
              <p> </p>
        
              <TextField style={{ width:'200px',height:'20px',padding:'10px'}}
                label="Enter Your Last Name"
                margin="normal"
                variant="outlined"
                floatingLabelText="Last Name"
                onChange={handleChange('lastName')}
                defaultValue={values.lastName}
              />
               <p> </p>
              <TextField style={{ width:'200px',height:'20px',padding:'10px'}}
                label="Enter Your Email"
                margin="normal"
                variant="outlined"
                floatingLabelText="Email"
                onChange={handleChange('email')}
                defaultValue={values.email}
              />
              <p> </p>
              <TextField style={{ width:'200px',height:'20px',padding:'10px'}}
                label="Enter your Date Of Birth"
                margin="normal"
                variant="outlined"
                floatingLabelText="Date Of Birth"
                onChange={handleChange('date_of_birth')}
                defaultValue={values.date_of_birth}
              />
               <p> </p>
               <TextField style={{ width:'200px',height:'20px',padding:'10px'}}
                label="Enter Your Constituency"
                margin="normal"
                variant="outlined"
                floatingLabelText="Contituency"
                onChange={handleChange('constituency')}
                defaultValue={values.constituency}
              />
               <p> </p>
               <TextField style={{ width:'200px',height:'20px',padding:'10px' }}
                label="Enter Your Aadhar Number"
                margin="normal"
                variant="outlined"
                floatingLabelText="Aadhar Number"
                onChange={handleChange('aadhar_number')}
                defaultValue={values.aadhar_number}
              />
               <p> </p>
               <Button variant="contained" color="black"  onClick={this.continue} >
               Submit
       
               <Icon>send</Icon>
               </Button>
              
            </React.Fragment>
          </div>
        );
      }
    }

export default FormUserDetails
