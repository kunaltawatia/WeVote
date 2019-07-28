import React from 'react'
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function navbar() {
    return (
      <div >
         <Appbar position="static" style ={{ backgroundColor: '#000033'}}>
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