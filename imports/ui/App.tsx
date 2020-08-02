import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Overview } from './pages/Overview';
// import { Overview } from './pages/Overview';



export class LyricsApp extends React.Component<{},{}> {


  render() {
  
  const nA404 = <div className="content chordsheet-colors">
        <DocumentTitle title="Hölibu | 404" />
        <span id="logo">
            <h1>404</h1>
            <h2>n/A</h2>
        </span>
    </div>;

    return (
    <BrowserRouter>
    <div>Gagi</div>
    <Switch>
        <Route path="/view/shits" component={Overview} />
        <Route>
            Gagi
        </Route>
    </Switch>
    </BrowserRouter>
    )
  }
}