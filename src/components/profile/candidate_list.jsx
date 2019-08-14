import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import * as contentful from 'contentful'
import Candidate from '../profile/candidate'
const SPACE_ID = '7pte3qqcp50e'
const ACCESS_TOKEN = 'Eu_I0CfdUjZ6FG0tDhypZchsaWtrtvCNg_kSIqMb1Mg'

const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
})

class candidate_list extends Component {
    state = {
        candidate: [],
        searchString: '',
        compare: []
    }
    constructor() {
        super()
        this.getCandidates()
    }
    getCandidates = () => {
        client.getEntries({
            content_type: 'candidates',
            query: this.state.searchString
        })
        .then((response) => {
            this.setState({candidate: response.items})
            console.log(this.state.candidate)
        })
        .catch((error) => {
          console.log("Error occurred while fetching Entries")
          console.error(error)
        })
    }
    onSearchInputChange = (event) => {
        console.log("Search changed ..." + event.target.value)
        if (event.target.value) {
            this.setState({searchString: event.target.value})
        } else {
            this.setState({searchString: ''})
        }
        this.getCandidates()
    }
    render() {
       
        return (
            <div>
               
                
                { this.state.candidate ? (
                    <div>
                        <TextField style={{padding: 24, color: 'white'}}
                            id="searchInput"
                            placeholder="Search for Candidate"   
                            margin="normal"
                            onChange={this.onSearchInputChange}
                            />
                        <Grid container spacing={24} style={{padding: 24}}>
                            
                            { this.state.candidate.map(currentCandidate => (
                              
                                <Grid item xs={12} sm={6} lg={4} xl={3} spacing={24}>
                                    <Candidate candidatee={currentCandidate} />
                                </Grid>
                            ))}
                        </Grid>
                        <Button  size="small" style={{ position:'absolute',backgroundColor: 'Blue',color:'white'}} >
                   Submit
                </Button>
                <Button size="small" color="primary" ></Button>
                    </div>
                ) : "No Candidate found" }
            </div>
        )
    }
}
export default candidate_list;