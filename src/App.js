import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";


import ReactJson from 'react-json-view';

import './App.css';
import Navbar from './Navbar';

function getTime() {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

class App extends React.Component {
  state = {
    ws: null,
    url: "wss://echo.websocket.org",
    msg: '',
    history: [],
    connected: false
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  connect() {

    const ws = new WebSocket(this.state.url); 
    this.setState({ws});

    this.setState({history: [
      ...this.state.history,
      {
        direction: 'INFO',
        time: getTime(),
        type: 'str',
        data: 'Connecting to ' + this.state.url
      }
    ]});

    const that = this;

    ws.onerror = (e) => {
      that.setState({history: [
        ...that.state.history,
        {
          direction: 'ERROR',
          time: getTime(),
          type: 'str',
          data: e.data
        }
      ]});
    }

    ws.onclose = (e) => {
      that.setState({history: [
        ...that.state.history,
        {
          direction: 'CLOSE',
          time: getTime(),
          type: 'str',
          data: 'code=' + e.code
        }
      ]});
    }
            
    ws.onopen = () => {
      console.log('CONNECTED: ' + that.state.url)

      that.setState({history: [
        ...that.state.history,
        {
          direction: 'INFO',
          time: getTime(),
          type: 'str',
          data: 'Connected to ' + that.state.url
        }
      ], connected: true});
    };
            
    
    ws.onmessage = (e) => {

      console.log("RECIEVED: "+ e.data);
      let data = e.data;
      let type = 'str';
      try {
        data = JSON.parse(e.data);
        type = 'json';
      } catch(e) {

      }
      that.setState({history: [
        ...that.state.history,
        {
          direction: 'RECEIVED',
          time: getTime(),
          type, data
        }
      ]})
    };
  }

  send() {
    console.log("SENT: "+ this.state.msg);
    this.state.ws.send(this.state.msg);
  }

  handleUrlChange(url) {
    this.setState({url});
  }

  handleMsgChange(msg) {
    this.setState({msg});
  }

  render() {
    return (
      <React.Fragment>
        <Navbar />
        <Container>
          <Row>
            <InputGroup size="sm">
              <FormControl
                placeholder="URL"
                aria-label="URL"
                aria-describedby="url"
                value={this.state.url}
                onChange={(evt) => this.handleUrlChange(evt.target.value)}
              />
              <InputGroup.Append>
                <Button 
                  variant="primary" 
                  onClick={() => this.connect()}
                >
                  {this.state.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Row>
          
          <Row>
          <div className="log-table-wrapper">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.history.map((val,idx) => {
                    return (
                      <tr>
                        <td>{val.time}</td> 
                        <td>{val.direction}</td>
                        <td>
                          {val.type == 'str' ? (
                            <pre>{val.data}</pre>
                          ) : (
                            <ReactJson src={val.data} />
                          )}
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </div>
          </Row>

          
          <Row>

          <div className="msg-div">
            <AceEditor
              mode="javascript"
              theme="github"
              value={this.state.msg}
              onChange={(evt) => this.handleMsgChange(evt)}
              name="UNIQUE_ID_OF_DIV"
              editorProps={{ $blockScrolling: true }}
              maxLines={10}
              minLines={3}
              width="100%"
              readOnly={!this.state.connected}
            />
            <Button 
              variant="primary" 
              onClick={() => this.send()}
              disabled={!this.state.connected}
            >
              Send
            </Button>
          </div>

          </Row>

          
        </Container>
      </React.Fragment>
    );
  }
  
}

export default App;
