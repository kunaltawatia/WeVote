import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Data from './candidatedetails.json.js'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'


class Profile extends Component {

  render() {
    return (
        <div>
                            { Data.map(currentCandidate => (
                              
                                   <div>
                                   { currentCandidate.id == this.props.match.params.id ?
                                    <div>
                                      <Grid  spacing={24}  style={{padding: 24}}>
                                    <Card classname='card' style={{  width : '350px'}}>
                                       <CardMedia >
                                       <img style={{height: '150px',width : '150px', borderRadius: '100%', marginLeft: 'auto' , marginRight: 'auto' }} src= {currentCandidate.image} alt="candidate" />
                                       </CardMedia>
                                       <CardContent>
                                           <Typography gutterBottom variant="headline" component="h2">
                                               {currentCandidate.name}
                                           </Typography>
                                           <Typography components="h2">
                                               <h3>{ currentCandidate.indian  ? <p> Indian : No </p> : <p>Indian : Yes </p>} </h3>
                                           </Typography>
                
                                           <Typography components="h2">
                                             <h3> age : { currentCandidate.age} </h3>
                                            </Typography>

                                            <Typography  component="h2" >
                                               <h3> date of Birth : { currentCandidate.dateofbirth} </h3>
                                             </Typography>

              
                                             <Typography components="h2">
                                               <h3> Criminal Records : { currentCandidate.criminalrecord} </h3>
                                              </Typography>
                                       </CardContent>
                                       </Card>
                                       </Grid>
                                       
                                       </div> : null  }
                                    </div>
                            ))}
        </div>
    );
  }
}
export default Profile