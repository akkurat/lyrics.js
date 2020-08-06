import { ITask, CTasks } from "../../api/tasks";
import React, { Props, FunctionComponent, MouseEvent, createRef, Ref, RefObject, useState } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Hyphenator } from "../components/Hyphenator";

export interface IShitDetailProps {
    shit_id: string
}
export interface IShitDetailState {
    // localText: string
}

var Hypher = require('hypher')
export const ShitDetail: FunctionComponent<IShitDetailProps> = (props: IShitDetailProps) => {

    const { task } = useTracker(() => {
        Meteor.subscribe('tasks');
        return ({
            task: CTasks.findOne({ _id: props.shit_id })
        });
    });

    const [text, setText] = useState(null)
    

    const textAreaRef: RefObject<HTMLTextAreaElement> = createRef()
    function handleSave(ev: MouseEvent) 
    {
        // Tasks.update( task._id,{ $set: {content: text}})
        Meteor.call('tasks.updateContent', task._id, text )
    }

    
    if (task) {
        if(text == null){setText(task.content)}
        return <div>
            <h1>{task.text}</h1>
            <textarea value={text} onChange={ev => setText(ev.currentTarget.value)}></textarea>
            <button onClick={handleSave}>Save</button>
            <Hyphenator text={text}></Hyphenator>
            </div>
    }
    else {
        return <div>Loading</div>
    }


}