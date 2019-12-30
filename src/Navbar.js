import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { FaGithub } from 'react-icons/fa';

import packageJson from '../package.json';

class MyNavbar extends React.Component{
  constructor(props) {
    super(props)
  }

  render(){
    return(
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand to='' activeClassName="active">WS Tester <small>ver. {packageJson.version}</small></Navbar.Brand>
          <Nav>
            <Nav.Link target="_blank" href="https://github.com/takasoft/ws-tester">
              <FaGithub />
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

export default MyNavbar;
