import React from 'react'
import { SentenceForm } from '../components/SentenceForm'
import { SentenceList } from '../components/SentenceList'
import { BrowserRouter, Route, Switch, withRouter, RouteComponentProps } from 'react-router-dom';
import { SentenceStats } from '../components/SentenceStats';
class Sentences_ extends React.Component<RouteComponentProps, {}> {

    render() {

        const parentPath = this.props.match.path;
        return (
            <div>
                {JSON.stringify(this.props)}
                <Switch>
                    <Route path={`${parentPath}list`}>
                        <div>
                            <SentenceForm></SentenceForm>
                            <SentenceList></SentenceList>
                        </div></Route>
                    <Route path={`${parentPath}stats`}>
                        <SentenceStats />
                    </Route>
                </Switch>
            </div>
        )

    }

}

export const Sentences = withRouter(Sentences_)