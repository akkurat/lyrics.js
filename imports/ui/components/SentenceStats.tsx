import { Component } from "react";
import React from "react";
import { Sentences, ISentence } from "../../api/sentences";
import { withTracker } from "meteor/react-meteor-data";

class SentenceStats_ extends Component<ISentencesTrackerProps> {
    render() {
        return <div>
            {JSON.stringify(this.extractWords().entries())}
        </div>
    }

    extractWords() {
       const s = this.props.sentences 

       const map = new Map<string, Counter>();

       for( const sentence of s )
       {
           for( const w of sentence.content.split(/\W/) )
           {
              if (map.has(w)) {
                  map.get(w).inc()
              } else {
                  map.set(w, new Counter())
              } 
           }
       }

       return map;
       
    }

}

class Counter {
    constructor(public count: number=1) {}
    inc() {
        this.count++;
    }
    toString() {
        return this.count
    }
}

export interface ISentencesTrackerProps {
    sentences: ISentence[]
    user: Meteor.User
}
const tracker = withTracker( p => {

    Meteor.subscribe('sentences');

    const a: ISentencesTrackerProps = {
      sentences: Sentences.find({}, {sort: {createdAt: -1}}).fetch(),
      user: Meteor.user(),
    }
    return a
})

export const SentenceStats = tracker(SentenceStats_)