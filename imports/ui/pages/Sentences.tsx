import React, { FunctionComponent } from 'react'
import { SentenceForm } from '../components/SentenceForm'
import { SentenceList } from '../components/SentenceList'
import { BrowserRouter, Route, Switch, withRouter, RouteComponentProps, NavLink } from 'react-router-dom';
import { SentenceStats } from '../components/SentenceStats';
import { IRelNav, RelNavComponent } from '../IRelNav';
import { SentenceDetail } from '../components/SentenceDetail';
class Sentences_ extends React.Component<RouteComponentProps, {}> {

    render() {

        const parentPath = this.props.match.path;
        return (
            <div className="h-100">
                {/* {JSON.stringify(this.props)} */}
                <Switch>
                    <Route path={`${parentPath}list`}>
                        <div>
                            <SentenceForm></SentenceForm>
                            <SentenceList></SentenceList>
                        </div></Route>
                    <Route path={`${parentPath}stats`}>
                        <SentenceStats />
                    </Route>
                    <Route path={`${parentPath}:id`} render={
                         p =>  <SentenceDetail id={p.match.params.id} />
                    }>
                    </Route>
                    <Route>
                        <RelNavComponent parentPath={parentPath} paths={sentencesNavJson}/>
                    </Route>
                </Switch>
            </div>
        )

    }

}

export const Sentences = withRouter(Sentences_)

export const sentencesNavJson: IRelNav[] = [
    {relpath: "list", caption: "List"},
    {relpath: "stats", caption: "Statistics"},
]

