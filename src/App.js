import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
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

  addHistory(evtType, data) {
    let dataType = 'str';
    try {
      data = JSON.parse(data);
      dataType  = 'json';
    } catch(e) {

    }
    this.setState({history: [
      ...this.state.history,
      {
        time: getTime(),
        evtType, dataType, data
      }
    ]});
  }

  connect() {
    if(this.state.connected) {
      this.state.ws.close();
      this.setState({
        ws: null,
        connected: false
      })
      return;
    }


    const ws = new WebSocket(this.state.url); 
    this.setState({ws});

    this.addHistory('INFO', 'Connecting to ' + this.state.url);

    const that = this;

    ws.onerror = (e) => {
      that.addHistory('ERROR', e.data);
    }

    ws.onclose = (e) => {
      that.addHistory('CLOSE', 'code='+e.code);
    }
            
    ws.onopen = () => {
      that.addHistory('INFO', 'Connected to ' + that.state.url);
      that.setState({connected: true});
    };
            
    ws.onmessage = (e) => {
      that.addHistory('RECIEVED', e.data);
    };
  }

  send() {
    this.state.ws.send(this.state.msg);
    this.addHistory('SENT', this.state.msg);
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
          
          </Row>
            <History history={this.state.history} />
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

class History extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.history = [];
  }
  componentDidUpdate() {
    // always scroll to the bottom
    this.ref.current.scrollTop = this.ref.current.scrollHeight;
  }
  render() {
    return (
      <div className="log-table-wrapper" ref={this.ref} onScroll={() => console.log(this.ref.current.scrollTop)}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Time</th>
              <th>Event</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.history.map((val,idx) => {
                return (
                  <tr>
                    <td>{val.time}</td> 
                    <td>{val.evtType}</td>
                    <td>
                      {val.dataType == 'str' ? (
                        <pre>{val.data}</pre>
                        // <AceEditor
                        //   mode="json"
                        //   theme="github"
                        //   value={val.data}
                        //   readOnly={true}
                        //   name="msg-display"
                        //   editorProps={{ $blockScrolling: true }}
                        //   maxLines={10}
                        //   minLines={3}
                        //   width="100%"
                        // />
                      ) : (
                        <ReactJson src={val.data} name={null} displayObjectSize={false} displayDataTypes={false} enableClipboard={false} />
                        
                      )}
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
