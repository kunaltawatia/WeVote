import React, { Component } from 'react'
import * as contentful from 'contentful'
import Display from '../components/profiledisplay'
import NavBar from '../components/navbar'
const SPACE_ID = '7pte3qqcp50e'
const ACCESS_TOKEN = 'Eu_I0CfdUjZ6FG0tDhypZchsaWtrtvCNg_kSIqMb1Mg'
 
const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
})
 
class Profile extends Component {
  
  state = {
    candidate: [],
    searchString: ''
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
  render() {
    return (
        <div>
            < NavBar />
            { this.state.candidate ? (
                    <div>
                        
                            { this.state.candidate.map(currentCandidate => (
                              
                                   <div>
                                   { currentCandidate.fields.id == this.props.match.params.id ?
                                    <Display candidatee={currentCandidate} />: null  }
                                    </div>
                            ))}
                    </div>
                ) : "No candidate found" }
        </div>
    );
  }
}
export default Profile