import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import * as contentful from 'contentful'
import {Link, Redirect} from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Compare from '../profile/compare.jsx'
import AddIcon from "@material-ui/icons/Add";
import Delete from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import SendIcon from "@material-ui/icons/Send";


const SPACE_ID = '7pte3qqcp50e'
const ACCESS_TOKEN = 'Eu_I0CfdUjZ6FG0tDhypZchsaWtrtvCNg_kSIqMb1Mg'

const client = contentful.createClient({
    space: SPACE_ID,
    accessToken: ACCESS_TOKEN
})

class candidate_list extends Component {
  
    state = {
        compare: [],
        candidate: [],
        searchString: '',
         show: false,
         
    }
    _onButtonClick = this._onButtonClick.bind(this);

_onButtonClick() {
    console.log(this.state.compare)
  this.setState({
    show: true,
  });
}
    constructor() {
        super()
        console.log(this.state.candidate)
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
    removePeople(e) {
        this.setState({compare: this.state.compare.filter(function(compare) { 
            return compare.fields.id !== e 
        })});
    }
    render() {
       
        return (
            <div style={{textAlign:'center'}}>
               
                
                { this.state.candidate ? (
                    <div >
                        <TextField style={{padding: 24, color: 'white'}}
                            id="searchInput"
                            placeholder="Search for Candidate"   
                            margin="normal"
                            onChange={this.onSearchInputChange}
                            />
                        <Grid container spacing={24} style={{padding: 24}}>
                            
                            { this.state.candidate.map(currentCandidate => (

                              
                                <Grid item xs={12} sm={6} lg={4} xl={3} spacing={24}>
                                   
                                    <div>
                                         <Card  style={{padding: 24, width:'250px',height:'350px',transparency:'50%'}} classname='card'>
                                            <CardMedia style={{height: '150px',width : '150px', borderRadius: '100%', marginLeft: 'auto' , marginRight: 'auto'}}
                                                image={currentCandidate.fields.profilePhoto.fields.file.url}
                                                title={currentCandidate.fields.title}
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="headline" component="h2">
                                                    {currentCandidate.fields.title}
                                                </Typography>
                                            </CardContent>
                                            
                                            
                                            <CardActions style={{ paddingBottom : '20%'}} >
                                                 <Button size="small" color="primary" >
                                                    <Link to={"profile/"+(currentCandidate.fields.id)}>
                                                    <Tooltip title="Check Profile">
                                                          < SendIcon />
                                                    </Tooltip>
                                                    </Link>
                                                </Button>
                                                <Button  size="small" style={{ color:'black'}} onClick={(event)=>{event.preventDefault();this.state.compare.push(currentCandidate)}} >
                                                <Tooltip title="Add to Compare">
                                                    < AddIcon />
                                                </Tooltip>
                                                </Button>
                                                
                                                <Button size="small" onClick={(event)=>{event.preventDefault(); this.removePeople(currentCandidate.fields.id)}} >
                                                <Tooltip title="Delete from Comparison">
                                                     < Delete />
                                                </Tooltip>
                                                </Button>


                                            </CardActions> 
                                         </Card>

                                     </div>
                                </Grid>
                            ))}
                         </Grid> 
                         <Button onClick={this._onButtonClick}  size="small" style={{ position:'absolute',backgroundColor: 'Blue',color:'white'}}>Compare </Button>
           {this.state.show ?
           <Compare array={this.state.compare}/>
          :
           null
           }

                    </div>
                ) : "No Candidate found" }
            </div>
        )
    }
}
export default candidate_list;
