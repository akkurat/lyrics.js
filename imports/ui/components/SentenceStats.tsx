import { Component, FunctionComponent, useState, useCallback, PureComponent } from "react";
import React from "react";
import { CSentences, ISentence } from "../../api/sentences";
import { withTracker } from "meteor/react-meteor-data";
import { CWords, IWord } from "../../api/words";
import { NavLink } from "react-router-dom";
import { SimpleParagraphs } from "./SentenceDetail";
import { Correlations } from "./SentenceCorrelations";
import { UsageList } from "./SentenceUsage";


class SentenceStats_ extends PureComponent<ISentencesTrackerProps, { wordMap }> {
    constructor(p) {
        super(p);
        this.state = { wordMap: new Map<string,ISentence[]>() }
    }
    render() {
        const entries = Array.from(this.state.wordMap.entries()).filter(([k, v]) => v.length > 1)
        entries.sort((e2, e1) => e1[1].size - e2[1].size)
        return <div className="stats-overview" >
            <div className="usagelists">
                {entries.map(([k, v]) => <UsageList title={k} usages={[...v.values()]} />)}
                {/* todo: serverside */}
                {/* <button onClick={ev => this.addToIndex([...wordMap.keys()])} >Add to index</button> */}
            </div>
            <div>
                <Correlations s={this.props.sentences} wordmap={this.state.wordMap} />
            </div>
        </div>
    }

    addToIndex(words: string[]) {
        Meteor.call('words.insert', words)
    }

    handleRowClicked(row, ev) {
    }

    createTable() {
        return [
            { name: 'Word', selector: 'word' },
            { name: 'Count', selector: 'count' }
        ]

    }

    componentDidMount() {
        Meteor.call('words.mapsentences', (error, data) => {
            this.setState({ wordMap: new Map(data) })
        })

    }




}

export interface ISentencesTrackerProps {
    sentences: ISentence[],
    user: Meteor.User
}
const tracker = withTracker(p => {

    Meteor.subscribe('sentences');

    const a: ISentencesTrackerProps = {
        sentences: CSentences.find({}, { sort: { createdAt: -1 } }).fetch(),
        user: Meteor.user(),
    }
    return a
})
export const SentenceStats = tracker(SentenceStats_)


