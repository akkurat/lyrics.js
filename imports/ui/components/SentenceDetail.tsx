import { Component } from "react";
import React from "react";
import { CSentences, ISentence } from "../../api/sentences";
import { withTracker } from "meteor/react-meteor-data";
import DataTable from 'react-data-table-component'
import { CWords } from "../../api/words";
import { ISentencesTrackerProps } from "./SentenceStats";

class SentenceStats_ extends Component<ISentenceTrackerProps & { id: string }> {
    render() {

        const s = this.props.sentence
        return <div>
            <div className="loading"></div>
            {s ?
                <div>
                    <h1>{s._id}</h1>
                    {s.content}
                </div>
                : null
            }
        </div>


    }


}

export interface ISentenceTrackerProps {
    sentence: ISentence
    user: Meteor.User
}
const tracker = withTracker<ISentenceTrackerProps, { id: string }>(p => {

    Meteor.subscribe('sentences');

    const a: ISentenceTrackerProps = {
        sentence: CSentences.findOne(p.id, { sort: { createdAt: -1 } }),
        user: Meteor.user(),
    }
    return a
})

export const SentenceDetail = tracker(SentenceStats_)