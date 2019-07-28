import React from 'react'
import {Link} from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const Candidate = (props) => {

    console.log(props)
    return(
        <div>
            { props.candidatee ? (
              
                <Card >
                <CardMedia style={{height: 0, paddingTop: '56.25%'}}
               image={props.candidatee.fields.profilePhoto.fields.file.url}
               title={props.candidatee.fields.title}
               />
                 <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                    {props.candidatee.fields.title}
                </Typography>
                
                </CardContent>
                <CardActions>
                <Button size="small" color="primary" >
                
                    <Link to={"profile/"+(props.candidatee.fields.id)}>
                    check profile
                    </Link>
                </Button>

                </CardActions> 
            </Card>
            ) :null  }
        </div>
    )
}

export default Candidate