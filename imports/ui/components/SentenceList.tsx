import { FunctionComponent } from "react";
import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { CSentences, ISentence } from "../../api/sentences";
import { NavLink } from "react-router-dom";

function handleItemClick(ev: React.MouseEvent<HTMLLIElement, MouseEvent>,s: ISentence) {
    if(ev.altKey) {
        ev.preventDefault()
        const success = Meteor.call('sentences.remove',s._id)
        return success
    }
    
}

export const SentenceList : FunctionComponent<{}> = () => {

    const {sentences,user} = useTracker( () => {
        Meteor.subscribe('sentences');

        return ({
          sentences: CSentences.find({}, {sort: {createdAt: -1}}).fetch(),
          user: Meteor.user(),
        });
    } )


    if( sentences ) {
        return <ul>

            {sentences.map( s => <NavLink to={s._id} ><li onClick={ev => handleItemClick(ev,s)}>{s.content}</li></NavLink>)}
            </ul>
    }

    return <div>Loading...</div>

}