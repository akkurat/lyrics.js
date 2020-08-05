import { FunctionComponent } from "react";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Sentences, ISentence } from "../../api/sentences";

function handleItemClick(ev: React.MouseEvent<HTMLLIElement, MouseEvent>,s: ISentence) {
    if(!ev.altKey) {
        const response = confirm( `Delete item ${s.content.substr(0,20)}… created on ${s.createdAt}?`)
        if(!response) {
            return;
        }
    }
    const success = Meteor.call('sentences.remove',s._id)
}

export const SentenceList : FunctionComponent<{}> = () => {

    const {sentences,user} = useTracker( () => {
        Meteor.subscribe('sentences');

        return ({
          sentences: Sentences.find({}, {sort: {createdAt: -1}}).fetch(),
          user: Meteor.user(),
        });
    } )


    if( sentences ) {
        return <ul>
            {sentences.map( s => <li onClick={ev => handleItemClick(ev,s)}>{s.content}</li>)}
            </ul>
    }

    return <div>Loading...</div>

}