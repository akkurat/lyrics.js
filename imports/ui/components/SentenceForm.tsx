import React, { useState, RefObject } from "react";
import {  FunctionComponent } from "react";
import { useTracker } from "meteor/react-meteor-data";

export const SentenceForm: FunctionComponent<{}> = () => {
    const [text,setText] = useState(null)
    const [splitlines,setSplitlines] = useState(false)
    function save() {
        Meteor.call('sentences.insert',text,Boolean(splitlines))
    }
    return <div>
        <textarea onChange={ev => setText(ev.target.value)}></textarea>
        <label htmlFor="chk">Split lines? {'(/\n{2,}/)'}</label>
        <input id="chk" type="checkbox" onChange={ev => setSplitlines(ev.target.checked)} />
        <button onClick={save}>Save</button>
    </div>
    
}