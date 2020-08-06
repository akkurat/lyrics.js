import React from 'react'
import { SentenceForm } from '../components/SentenceForm'
import { SentenceList } from '../components/SentenceList'
import { BrowserRouter, Route, Switch, withRouter, RouteComponentProps, NavLink } from 'react-router-dom';
import { SentenceStats } from '../components/SentenceStats';
import { WordList } from '../components/WordList';
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
                        <NavLink to={`${parentPath}list`}>List</NavLink>
                    </Route>
                </Switch>
            </div>
        )

    }

}

export const Words = withRouter(Sentences_)