import React, { Component } from 'react';
import FormUserDetails from './FormUserDetails';
import Confirm from './Confirm';


// parent class 
export class Registration extends Component {
  state = {
    step: 1,
    firstName: '',
    lastName: '',
    email: '',
    date_of_birth: '',
    constituency: '',
    aadhar_number: ''
  };
  nextStep = () => {
    const { step } = this.state;
    this.setState({
      step: step + 1
    });
  };
  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1
    });
  };
  handleChange = input => e => {
    this.setState({ [input]: e.target.value });
  };
  render() {
    const { step } = this.state;
    const { firstName, lastName, email, date_of_birth, constituency, aadhar_number } = this.state;
    const values = { firstName, lastName, email, date_of_birth, constituency, aadhar_number };
    switch (step) {
      case 1:
        return (
          <FormUserDetails
            nextStep={this.nextStep}
            handleChange={this.handleChange}
            values={values}
         />
        );
      case 2:
        return (
          <Confirm
            nextStep={this.nextStep}
            prevStep={this.prevStep}
            values={values}
          />
        
        );
      case 3:
        return <h1> success </h1>;
    }
  }
}

export default Registration;