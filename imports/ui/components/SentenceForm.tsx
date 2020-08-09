import React, { useState, RefObject } from "react";
import { FunctionComponent } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { TextType } from "../../api/sentences";
import { isNumber } from "underscore";

export const SentenceForm: FunctionComponent<{}> = () => {
    const [text, setText] = useState(null)
    const [splitlines, setSplitlines] = useState(false)
    const [type, setType] = useState(TextType.PHRASE)
    function save() {
        Meteor.call('sentences.insert', text, type, Boolean(splitlines))
    }

    return <div>
        <textarea onChange={ev => setText(ev.target.value)}></textarea>
        <label htmlFor="chk">Split lines? {'(/\n{2,}/)'}</label>
        <input id="chk" type="checkbox" onChange={ev => setSplitlines(ev.target.checked)} />
        <select onChange={ev => setType(ev.target.value)}>
            {Object.entries(TextType).filter(([k,v])=> isFinite( parseInt(k) )).map(([k,v]) => <option value={v}>{v}</option>)}
        </select>
        <button onClick={save}>Save</button>
    </div>

}