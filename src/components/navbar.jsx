import React from 'react'
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

  sideList = side => (
    <div
      role="presentation"
      onClick={this.toggleDrawer(side, false)}
      onKeyDown={this.toggleDrawer(side, false)}
    >
      <div style={{ width: '15vw' }}>
        <List style={{margin:20}}>
          <ListItem button >
            <ListItemText primary='Home' />
          </ListItem>
          <ListItem button >
            <ListItemText primary='Create Poll' />
          </ListItem>
          <ListItem button >
            <ListItemText primary='Build Petition' />
          </ListItem>
          <ListItem button >
            <ListItemText primary='Create Database' />
          </ListItem>
          <ListItem button >
            <ListItemText primary='Vote' />
          </ListItem>
        </List>
      </div>
    </div>
  );
  render() {
    return (
      <div >
        <div style={{
          position:'fixed',
          top: '20px', left: '20px'
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
