import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Overview } from './pages/Overview';
import { ShitDetail } from './pages/ShitDetail';
import { Sentences } from './pages/Sentences'
import { Words } from './pages/Words';
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
        <Route path="/sentences/" exact={false}><Sentences/></Route>
        <Route path="/words/" exact={false}><Words/></Route>
        <Route path="/view/shits/:shitid" render={(routerProps) => {
                    const shitid = routerProps.match.params.shitid
                    return <ShitDetail shit_id={shitid} />
                }

        } >
        </Route>
        <Route path="/view/shits"><Overview/></Route>
        <Route>
            {nA404}
        </Route>
    </Switch>
    </BrowserRouter>
    )
  }
}