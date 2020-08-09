import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import DocumentTitle from 'react-document-title';
import { Overview } from './pages/Overview';
import { ShitDetail } from './pages/ShitDetail';
import { Sentences, sentencesNavJson } from './pages/Sentences'
import { Words, wordNavsJson } from './pages/Words';
import { IRelNav, RelNavComponent } from './IRelNav';
// import { Overview } from './pages/Overview';


const navs: IRelNav[] = [
    { caption: "Words", relpath: "words", children: wordNavsJson },
    { caption: "Lyrics", relpath: "sentences", children: sentencesNavJson },
]

export class LyricsApp extends React.Component<{}, {}> {


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
                <div className="fixed-nav">
                    <RelNavComponent parentPath="/" paths={navs} />
                </div>
                <Switch>
                    <Route path="/sentences/" exact={false}><Sentences /></Route>
                    <Route path="/words/" exact={false}><Words /></Route>
                    <Route path="/view/shits/:shitid" render={(routerProps) => {
                        const shitid = routerProps.match.params.shitid
                        return <ShitDetail shit_id={shitid} />
                    }

                    } >
                    </Route>
                    <Route path="/view/shits"><Overview /></Route>
                    <Route>
                        <RelNavComponent parentPath="/" paths={navs} />

                    </Route>
                </Switch>
            </BrowserRouter>
        )
    }
}