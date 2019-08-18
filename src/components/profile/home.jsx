import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import { Link, Redirect } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Compare from './compare.jsx'
import AddIcon from "@material-ui/icons/Add";
import Delete from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import SendIcon from "@material-ui/icons/Send";
import Data from './candidatedetails.json'

function searchingfor(searchstring) {
    return function (x) {
        return x.name.toLowerCase().includes(searchstring.toLowerCase()) || !searchstring;
    }
}
class Home extends Component {

    state = {
        compare: [],
        Data: Data,
        show: false,
        searchstring: '',

    }
    _onButtonClick = this._onButtonClick.bind(this);

    _onButtonClick() {
        console.log(this.state.compare)
        this.setState({
            show: true,
        });
    }
    onSearchInputChange = (event) => {
        console.log("Search changed ..." + event.target.value)
        if (event.target.value) {
            this.setState({ searchstring: event.target.value })
        } else {
            this.setState({ searchstring: '' })
        }
    }
    removePeople(e) {
        this.setState({
            compare: this.state.compare.filter(function (compare) {
                return compare.id !== e
            })
        });
    }
    render() {
        return (
            <div style={{ textAlign: 'center' }}>
                <TextField style={{ padding: 24, color: 'white' }}
                    id="searchInput"
                    placeholder="Search By Name"
                    margin="normal"
                    onChange={this.onSearchInputChange}
                />
                <div >
                    <Grid container spacing={24} style={{ padding: 24 }}>
                        {this.state.Data.filter(searchingfor(this.state.searchstring)).map(currentCandidate => (
                            <Grid spacing={24} style={{ padding: 24 }} >
                                <div>
                                    <Card classname='card' style={{ backgroundColor: '#F4F6F6', boxShadow: '10', width: '300px', height: '350px' }} >
                                        <CardMedia>
                                            <img style={{ height: '150px', width: '150px', borderRadius: '100%', marginLeft: 'auto', marginRight: 'auto' }}
                                                src={currentCandidate.image} alt="candidate" />
                                        </CardMedia>
                                        <CardContent>
                                            <Typography gutterBottom variant="headline" component="h2">
                                                {currentCandidate.name}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary" >
                                                <Link to={"profile/" + (currentCandidate.id)}>
                                                    <Tooltip title="Check Profile">
                                                        < SendIcon />
                                                    </Tooltip>
                                                </Link>
                                            </Button>
                                            <Button size="small" style={{ color: 'black' }} onClick={(event) => { event.preventDefault(); this.state.compare.push(currentCandidate) }} >
                                                <Tooltip title="Add to Compare">
                                                    < AddIcon />
                                                </Tooltip>
                                            </Button>

                                            <Button size="small" onClick={(event) => { event.preventDefault(); this.removePeople(currentCandidate.id) }} >
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
                    <Button onClick={this._onButtonClick} size="small" style={{ position: 'absolute', backgroundColor: 'Blue', color: 'white' }}>Compare </Button>
                    {this.state.show ?
                        <Compare array={this.state.compare} />
                        :
                        null
                    }
                </div>
            </div>
        )
    }
}
export default Home;
