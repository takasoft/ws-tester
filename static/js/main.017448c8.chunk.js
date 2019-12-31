(this["webpackJsonpws-tester"]=this["webpackJsonpws-tester"]||[]).push([[0],{36:function(e){e.exports=JSON.parse('{"name":"ws-tester","version":"0.1.2","private":true,"homepage":".","dependencies":{"@testing-library/jest-dom":"^4.2.4","@testing-library/react":"^9.4.0","@testing-library/user-event":"^7.2.1","ace-builds":"^1.4.7","bootstrap":"^4.4.1","react":"^16.12.0","react-ace":"^8.0.0","react-bootstrap":"^1.0.0-beta.16","react-dom":"^16.12.0","react-icons":"^3.8.0","react-json-view":"^1.19.1","react-scripts":"3.3.0"},"scripts":{"start":"react-scripts start","build":"react-scripts build","test":"react-scripts test","eject":"react-scripts eject","predeploy":"npm run build","deploy":"gh-pages -d build"},"eslintConfig":{"extends":"react-app"},"browserslist":{"production":[">0.2%","not dead","not op_mini all"],"development":["last 1 chrome version","last 1 firefox version","last 1 safari version"]},"devDependencies":{"gh-pages":"^2.1.1"}}')},44:function(e,t,a){e.exports=a(64)},49:function(e,t,a){},60:function(e,t,a){},64:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(12),i=a.n(s),o=(a(49),a(42)),c=a(13),l=a(14),d=a(19),u=a(15),h=a(20),m=(a(50),a(24)),p=a(16),g=a(23),y=a(43),b=a(40),v=a(38),w=a(39),f=a(34),E=a.n(f),k=(a(58),a(59),a(35)),S=a.n(k),O=(a(60),a(25)),C=a(26),j=a(41),H=a(36),N=function(e){function t(){return Object(c.a)(this,t),Object(d.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return r.a.createElement(O.a,{bg:"light",variant:"light",id:"main-navbar"},r.a.createElement(p.a,null,r.a.createElement(O.a.Brand,{to:""},"WS Tester ",r.a.createElement("small",null,"ver. ",H.version)),r.a.createElement(C.a,null,r.a.createElement(C.a.Link,{target:"_blank",href:"https://github.com/takasoft/ws-tester"},r.a.createElement(j.a,null)))))}}]),t}(r.a.Component),L=window.innerHeight-60-31-42,T=10,V=3,W=14;function x(){var e=new Date;return e.getHours()+":"+e.getMinutes()+":"+e.getSeconds()}var D=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,s=new Array(n),i=0;i<n;i++)s[i]=arguments[i];return(a=Object(d.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).state={ws:null,url:"wss://echo.websocket.org",msg:"",history:[],logViewHeight:L+"px"},a.refLogView=r.a.createRef(),a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){}},{key:"addHistory",value:function(e,t){var a=this,n="str";try{t=JSON.parse(t),n="json"}catch(r){}this.setState({history:[].concat(Object(o.a)(this.state.history),[{time:x(),evtType:e,dataType:n,data:t}])},(function(){a.refLogView.current.scrollTop=a.refLogView.current.scrollHeight}))}},{key:"connect",value:function(){if(this.state.ws&&this.state.ws.readyState===WebSocket.OPEN)return this.state.ws.close(),void this.setState({ws:null});var e=new WebSocket(this.state.url);this.setState({ws:e}),this.addHistory("INFO","Connecting to "+this.state.url);var t=this;e.onerror=function(e){t.addHistory("ERROR",e.data)},e.onclose=function(e){t.addHistory("CLOSE","code="+e.code)},e.onopen=function(){t.addHistory("INFO","Connected to "+t.state.url)},e.onmessage=function(e){t.addHistory("RECIEVED",e.data)}}},{key:"send",value:function(){this.state.ws.send(this.state.msg),this.addHistory("SENT",this.state.msg)}},{key:"handleUrlChange",value:function(e){this.setState({url:e})}},{key:"handleMsgChange",value:function(e){var t,a=this,n=((t=e.split("\n").length)<=V?L:(t>T&&(t=T),L-W*(t-V)))+"px";this.setState({msg:e,logViewHeight:n},(function(){a.refLogView.current.scrollTop=a.refLogView.current.scrollHeight}))}},{key:"render",value:function(){var e=this;return r.a.createElement(n.Fragment,null,r.a.createElement(N,null),r.a.createElement(p.a,{id:"app-container"},r.a.createElement(v.a,{noGutters:!0,id:"row_main"},r.a.createElement(w.a,{id:"col_main"},r.a.createElement(g.a,{size:"sm",id:"url-input-container"},r.a.createElement(y.a,{placeholder:"URL","aria-label":"URL","aria-describedby":"url",value:this.state.url,onChange:function(t){return e.handleUrlChange(t.target.value)},onKeyDown:function(t){13===t.keyCode&&e.connect()}}),r.a.createElement(g.a.Append,null,r.a.createElement(m.a,{variant:"primary",onClick:function(){return e.connect()},disabled:this.state.ws&&this.state.ws.readyState===WebSocket.CONNECTING},this.state.ws&&this.state.ws.readyState===WebSocket.OPEN?"Disconnect":"Connect"))),r.a.createElement("div",{id:"log-table-container",ref:this.refLogView,style:{minHeight:this.state.logViewHeight}},r.a.createElement(b.a,{size:"sm",id:"log-table"},r.a.createElement("tbody",null,this.state.history.map((function(e,t){return r.a.createElement("tr",{key:t},r.a.createElement("td",null,e.time),r.a.createElement("td",null,e.evtType),r.a.createElement("td",{className:"data-col"},"str"===e.dataType?r.a.createElement("pre",null,e.data):r.a.createElement(S.a,{src:e.data,name:null,displayObjectSize:!1,displayDataTypes:!1,enableClipboard:!1})))}))))),r.a.createElement("div",{id:"msg-div"},r.a.createElement("div",{id:"msg-editor-div"},r.a.createElement(E.a,{mode:"javascript",theme:"github",value:this.state.msg,onChange:function(t){return e.handleMsgChange(t)},name:"msg-editor",editorProps:{$blockScrolling:!0},maxLines:T,minLines:V,width:"100%",readOnly:!(this.state.ws&&this.state.ws.readyState===WebSocket.OPEN)})),r.a.createElement(m.a,{variant:"primary",size:"sm",onClick:function(){return e.send()},disabled:!(this.state.ws&&this.state.ws.readyState===WebSocket.OPEN),id:"msg-submit"},"Send"))))))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[44,1,2]]]);
//# sourceMappingURL=main.017448c8.chunk.js.map