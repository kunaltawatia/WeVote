import React, { Component } from 'react'
import { Grid } from "@material-ui/core";
import * as contentful from 'contentful'
import Display from './profiledisplay'
const SPACE_ID = '7pte3qqcp50e'
const ACCESS_TOKEN = 'Eu_I0CfdUjZ6FG0tDhypZchsaWtrtvCNg_kSIqMb1Mg'

const client = contentful.createClient({
  space: SPACE_ID,
  accessToken: ACCESS_TOKEN
})

export default class Election extends Component {

  constructor(props) {
    super(props);
    this.state = {
      candidate: [],
      searchString: ''
    }

  }
  componentDidMount() {
    client.getEntries({
      content_type: 'candidates',
      query: this.state.searchString
    })
      .then((response) => {
        this.setState({ candidate: response.items })
        console.log(this.state.candidate)
      })
      .catch((error) => {
        console.log("Error occurred while fetching Entries")
        console.error(error)
      })
  }
  render() {
    return (
      <div>
        {this.state.candidate ? (
          <div>
            <Grid container spacing={2}>
              {this.state.candidate.map(currentCandidate => {
                return <Display candidatee={currentCandidate} />
              })}
            </Grid>
          </div>
        ) :
          <p>No candidate found</p>
        }
      </div>
    );
  }
}