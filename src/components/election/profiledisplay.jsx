import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

const Display = (props) => {

    console.log(props)
    return (
        <div style={{ textAlign: 'center' }}>
            {props.candidatee ? (
                <Card classname='card'>
                    <CardMedia style={{ height: '150px', width: '150px', borderRadius: '100%', marginLeft: 'auto', marginRight: 'auto' }}
                        image={props.candidatee.fields.profilePhoto.fields.file.url}
                        title={props.candidatee.fields.title}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="headline" component="h1">
                            <h2> {props.candidatee.fields.title} </h2>
                        </Typography>
                        <Typography components="h2">
                            <h3>{props.candidatee.fields.indian ? <p> Indian : Yes </p> : <p>Indian : No </p>} </h3>
                        </Typography>

                        <Typography components="h2">
                            <h3> age : {props.candidatee.fields.age} </h3>
                        </Typography>

                        <Typography components="h2">
                            <h3> Political Party : {props.candidatee.fields.politicalParty} </h3>
                        </Typography>

                        <Typography components="h2">
                            <h3> State : {props.candidatee.fields.state} </h3>
                        </Typography>

                        <Typography components="h2">
                            <h3> Constituency : {props.candidatee.fields.Constituency} </h3>
                        </Typography>
                        <Typography components="h2">
                            <h3> Criminal Records : {props.candidatee.fields.criminalRecords} </h3>
                        </Typography>
                    </CardContent>
                </Card>
            ) : null}
        </div>
    )
}

export default Display