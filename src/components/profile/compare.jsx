import React from 'react';  
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
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
                                         <Card classname='card' style={{  width : '350px', backgroundColor: "#F9F1F7"}} >
                                         <CardMedia >
                                         <img style={{height: '150px', width : '150px', borderRadius: '100%', marginLeft: 'auto' , marginRight: 'auto'}} src= {currentCandidate.image} alt="candidate" />
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