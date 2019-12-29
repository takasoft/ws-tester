import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";


import ReactJson from 'react-json-view';

import './App.css';

function getTime() {
  const today = new Date();
  return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}

class App extends React.Component {
  state = {
    ws: null,
    url: "wss://echo.websocket.org",
    msg: '',
    history: [
    ]
  }
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  connect() {
    const ws = new WebSocket(this.state.url); 
    this.setState({ws});

    const that = this;
            
    
    ws.onopen = () => {
      console.log('CONNECTED: ' + this.state.url)

      that.setState({history: [
        ...that.state.history,
        {
          direction: 'INFO',
          time: getTime(),
          type: 'str',
          data: 'Connected to ' + this.state.url
        }
      ]})
    };
            
    
    ws.onmessage = function (e) {

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
      <Container>
        <InputGroup className="mb-3">
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
              Connect
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <ListGroup>
          {
            this.state.history.map((val,idx) => {
              return (
                <ListGroup.Item className="url-input-div">
                  {/* <AceEditor
                    mode="json"
                    theme="github"
                    value={val}
                    readOnly={true}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{ $blockScrolling: true }}
                  /> */}
                  {val.time} [{val.direction}] 
                  {val.type == 'str' ? (
                    val.data
                  ) : (
                    <ReactJson src={val.data} />
                  )}
                  
                </ListGroup.Item>
              )
            })
          }
        </ListGroup>
        {/* <div>
          <TextField
            label="URL"
            id="standard-adornment-amount"
            value={this.state.url}
            onChange={(evt) => this.handleUrlChange(evt.target.value)}
          />
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => this.connect()}
          >
            Connect
          </Button>
        </div> */}

        <div>
          <AceEditor
            mode="json"
            theme="github"
            value={this.state.msg}
            onChange={(evt) => this.handleMsgChange(evt)}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            maxLines={10}
            minLines={3}
            width="100%"
          />
          <Button 
            variant="primary" 
            onClick={() => this.send()}
            disabled={!this.state.ws}
          >
            Send
          </Button>
        </div>
      </Container>
    );
  }
  
}

export default App;
