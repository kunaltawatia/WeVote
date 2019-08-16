import React from 'react';
import { Link } from 'react-router-dom';
import { Button, List, ListItem, Divider, SwipeableDrawer, ListItemText, Fab } from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";

export default class Navbar extends React.Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  }

  toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    this.setState({ [side]: open });
  };
  _handleClick(e) {
    e.preventDefault();
    console.log(e.target.id, this.props.history);
  };
  sideList = side => (
    <div
      role="presentation"
      onClick={this.toggleDrawer(side, false)}
      onKeyDown={this.toggleDrawer(side, false)}
    >
      <div style={{ width: '15vw',minWidth:350 }} >
        <img style={{ width: "100%" }} src="./img/logoBig.jpg" alt="Logo" />
        <List style={{ margin: 20 }}>
          <ListItem id="home">
            <a href="./" style={{ textDecoration: 'none', color: 'black' }}>
              <ListItemText primary='Home' />
            </a>
          </ListItem>
          <ListItem><a href="./vote" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText primary='Vote' />
          </a>
          </ListItem>
          <ListItem>
            <a href="./createpoll" style={{ textDecoration: 'none', color: 'black' }}>
              <ListItemText primary='Create Poll Contract' />
            </a>
          </ListItem>
          <ListItem><a href="./buildpetition" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText primary='Build Petition Contract' />
          </a>
          </ListItem>
          <ListItem><a href="./createdatabase" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText primary='Create Database Contract' />
          </a>
          </ListItem>
          <ListItem><a href="./database" style={{ textDecoration: 'none', color: 'black' }}>
            <ListItemText primary='Database Contract Interaction' />
          </a>
          </ListItem>
        </List>
      </div>
    </div>
  );
  render() {
    return (
      <div >
        <div style={{
          position: 'fixed',
          top: '20px', left: '20px',
        }}>
          <Fab onClick={this.toggleDrawer('left', true)}><MenuIcon /></Fab>
        </div>
        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          onOpen={this.toggleDrawer('left', true)}
        >
          {this.sideList('left')}
        </SwipeableDrawer>
      </div>
    );
  }
}
