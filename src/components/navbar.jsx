import React from 'react'
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function navbar() {
    return (
      <div >
         <Appbar  style ={{position: "absolute", backgroundColor: '#000033',width:'100%'}}>
           <Toolbar >
             <Typography style ={{ color: 'white'}}>
               Candidate Comparator
             </Typography>
           </Toolbar>
         </Appbar>
         <p> </p>
      </div>
    );
  }
  
  export default navbar;