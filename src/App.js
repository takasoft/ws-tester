import React, {Fragment} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import ReactJson from 'react-json-view';

import './App.css';
import Navbar from './Navbar';


// calc for css doesn't work here
const logTableHeightOrg = window.innerHeight - 60 - 31 - 42;
const editorMaxLines = 10;
const editorMinLines = 3;
const editorLineHeight = 14;

function calcLogViewHeight(numLines) {
  if(numLines <= editorMinLines) return logTableHeightOrg;
  if(numLines > editorMaxLines) numLines = editorMaxLines;
  const editorExtraHeight = editorLineHeight * (numLines - editorMinLines);
  return logTableHeightOrg - editorExtraHeight;
}

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
    logViewHeight: logTableHeightOrg+"px",
  }
  refLogView = React.createRef()

  // constructor(props) {
  //   super(props);
  // }

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
    ]}, () => {
      // always scroll to the bottom
      this.refLogView.current.scrollTop = this.refLogView.current.scrollHeight;
    });
  }

  connect() {
    if(this.state.ws && this.state.ws.readyState === WebSocket.OPEN) {
      this.state.ws.close();
      this.setState({ws: null});
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
    const logViewHeight = calcLogViewHeight(msg.split("\n").length)+"px";
    //console.log(logViewHeight, this.state.logViewHeight);
    this.setState({msg, logViewHeight}, () => {
      // always scroll to the bottom
      this.refLogView.current.scrollTop = this.refLogView.current.scrollHeight;
    });
  }

  render() {
    return (
      <Fragment>
        <Navbar />
        <Container id="app-container">
          <Row noGutters={true} id="row_main">
            <Col id="col_main">
              <InputGroup size="sm" id="url-input-container">
                <FormControl
                  placeholder="URL"
                  aria-label="URL"
                  aria-describedby="url"
                  value={this.state.url}
                  onChange={(evt) => this.handleUrlChange(evt.target.value)}
                  onKeyDown={(e) => {if(e.keyCode === 13) this.connect()}}
                />
                <InputGroup.Append>
                  <Button 
                    variant="primary" 
                    onClick={() => this.connect()}
                    disabled={this.state.ws && this.state.ws.readyState === WebSocket.CONNECTING}
                  >
                    {(this.state.ws && this.state.ws.readyState === WebSocket.OPEN) ? 'Disconnect' : 'Connect'}
                  </Button>
                </InputGroup.Append>
              </InputGroup>

              <div id="log-table-container" ref={this.refLogView} style={{minHeight: this.state.logViewHeight}}> 
                <Table size="sm" id="log-table">
                  {/* <thead>
                    <tr>
                      <th>Time</th>
                      <th>Event</th>
                      <th>Data</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    {
                      this.state.history.map((val,idx) => {
                        return (
                          <tr key={idx}>
                            <td>{val.time}</td> 
                            <td>{val.evtType}</td>
                            <td>
                              {val.dataType === 'str' ? (
                                <pre>{val.data}</pre>
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
              
              <div id="msg-div">
                <div id="msg-editor-div">
                  <AceEditor
                    mode="javascript"
                    theme="github"
                    value={this.state.msg}
                    onChange={(data) => this.handleMsgChange(data)}
                    name="msg-editor"
                    editorProps={{ $blockScrolling: true }}
                    maxLines={editorMaxLines}
                    minLines={editorMinLines}
                    width="100%"
                    readOnly={!(this.state.ws && this.state.ws.readyState === WebSocket.OPEN)}
                  />
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => this.send()}
                  disabled={!(this.state.ws && this.state.ws.readyState === WebSocket.OPEN)}
                  id="msg-submit"
                >
                  Send
                </Button>
              </div>
            </Col>
          </Row>
        </Container>

      </Fragment>
    );
  }
}

export default App;
