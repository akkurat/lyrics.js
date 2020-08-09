import React, { FunctionComponent } from 'react'
import { SentenceForm } from '../components/SentenceForm'
import { SentenceList } from '../components/SentenceList'
import { BrowserRouter, Route, Switch, withRouter, RouteComponentProps, NavLink } from 'react-router-dom';
import { SentenceStats } from '../components/SentenceStats';
import { WordList } from '../components/WordList';
import { IRelNav, RelNavComponent } from '../IRelNav';
class Sentences_ extends React.Component<RouteComponentProps, {}> {

    render() {

        const parentPath = this.props.match.path;
        return (
            <div>
                {/* {JSON.stringify(this.props)} */}
                <Switch>
                    <Route path={`${parentPath}list`}>
                        <div>
                            <WordList></WordList>
                        </div></Route>
                    <Route>
                        <RelNavComponent parentPath={parentPath} paths={wordNavsJson} />
                    </Route>
                </Switch>
            </div>
        )

    }

}

export const Words = withRouter(Sentences_)


    export const wordNavsJson: IRelNav[] = [{caption: "List", relpath: "list"}]  