import React from 'react';
import {CssBaseline,Container} from '@material-ui/core';
import BootstrapContainer from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Row';
import Row from 'react-bootstrap/Col';


import MainComponent from './Components/MainComponent';

function App() {

  return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">
          <BootstrapContainer>
          <br/>
            <Row>
              <Col><h2>Movies-Subscriptions Web Site</h2></Col>
              <br/>
            </Row>
          </BootstrapContainer>
          <MainComponent /><br/><br/>
          <BootstrapContainer>
            <Row>
              <Col><h5>Written by: Dani Shitrit</h5></Col>
            </Row>
          </BootstrapContainer>
          
        </Container>
      </React.Fragment>
    
  );
}

export default App;
