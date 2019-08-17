import React from 'react';  
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import './compare.css';  
import CloseIcon from "@material-ui/icons/Close";

const Compare = (props) =>{
    console.log(props)
    function refreshPage(){ 
        window.location.reload() 
      }
    return(
        <div className='popup'>  
        <div className='popup\_inner'>   
       
        <div>
               <Button  class='icon' onClick={ refreshPage } >
                   <CloseIcon />
                  
                </Button>
                
                { props.array ? (
                    <div>
                        <Grid container spacing={24} style={{padding: 24}}>
                            
                            { props.array.map(currentCandidate => (

                              
                                <Grid  spacing={24}  style={{padding: 24}}>
                                   
                                    <div>
                                         <Card classname='card' style={{  width : '350px'}} >
                                         <CardMedia style={{height: '150px', width : '150px', borderRadius: '100%', marginLeft: 'auto' , marginRight: 'auto'}}
                                                image={currentCandidate.fields.profilePhoto.fields.file.url}
                                                title={currentCandidate.fields.title}
                                            />
                                             <CardContent>
                                        <Typography gutterBottom variant="headline" component="h2">
                                        <h4><p> {currentCandidate.fields.title} </p></h4>
                                        </Typography>
                                            <Typography components="h2">
                                            <h4>{ currentCandidate.fields.indian  ? <p> Indian : Yes </p> : <p>Indian : No </p>} </h4>
                                           </Typography>
                
                                             <Typography components="h2">
                                            <h4> age : { currentCandidate.fields.age} </h4>
                                            </Typography>

                                            <Typography components="h2">
                                             <h4> Political Party : { currentCandidate.fields.politicalParty} </h4>
                                            </Typography>

                                             <Typography components="h2">
                                            <h4> State : { currentCandidate.fields.state} </h4>
                                            </Typography>

                                            <Typography components="h2">
                                            <h4> Constituency : { currentCandidate.fields.Constituency} </h4>
                                            </Typography>
                                            <Typography components="h2">
                                            <h4> Criminal Records : { currentCandidate.fields.criminalRecords} </h4>
                                            </Typography>
                                            </CardContent>
                                             
                                         </Card>

                                     </div>
                                </Grid>
                            ))}
                         </Grid> 
                        
                    </div>
                ) : "No Candidate found" }
            </div>
            </div>
            </div>
       
    )
}

export default Compare;