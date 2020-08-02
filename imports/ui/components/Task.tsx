import React, {PropsWithChildren, ReactElement, ReactNode} from 'react';
import { FunctionComponent, useState } from 'react'
import classnames from 'classnames';

import { ITask } from '../../api/tasks';

export interface TaskProps {
  task: ITask,
}
export const Task: FunctionComponent<TaskProps> = ({ task, onCheckboxClick, onDeleteClick, onTogglePrivateClick }) => {
  const classes = classnames('task', {
    'checked': Boolean(task.isChecked)
  });

    const top = <React.Fragment> <button onClick={() => onDeleteClick(task)}>&times;</button>
        <button onClick={() => onTogglePrivateClick(task)}>{task.isPrivate ? 'Private' : 'Public'}</button>
        <span>{task.text} {task.username && <i>({task.username})</i>}</span>
        <span>{task.content ? <>&hellip;</> : ''}</span> 
        <input
            type="checkbox"
            checked={Boolean(task.isChecked)}
            onClick={() => onCheckboxClick(task)}
            readOnly
        /></React.Fragment>
  return (
    <li className={classes}>
        <ContentOpener top={top }>
      <div>{task.content}</div>
      </ContentOpener>
    </li>
  );
};

export const ContentOpener: FunctionComponent = (props: PropsWithChildren<{top: ReactNode}>) => {
  const [open, setOpen] = useState(false);

  return <div className={"toggle"}  onClick={() => setOpen(!open)}>
      <div>{props.top}</div>
   { open ? <div>{props.children}</div> : ""}
  </div>

}


