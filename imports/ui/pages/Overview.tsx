import React, { useState, FunctionComponent } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';
import { Task } from '../components/Task';
import { CTasks } from '../../api/tasks';
import { TaskForm } from '../components/TaskForm';
import { LoginForm } from '../components/LoginForm';

const toggleChecked = ({ _id, isChecked }) => {
  Meteor.call('tasks.setChecked', _id, !isChecked);
};

const togglePrivate = ({ _id, isPrivate }) => {
  Meteor.call('tasks.setPrivate', _id, !isPrivate);
};

const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);

export const Overview: FunctionComponent = () => {
  const filter = {};

  const [hideCompleted, setHideCompleted] = useState(false);

  if (hideCompleted) {
    _.set(filter, 'checked', false);
  }

  // TODO: class component would make more sense here
  const { tasks, incompleteTasksCount, user } = useTracker(() => {
    Meteor.subscribe('tasks');

    return ({
      tasks: CTasks.find(filter, {sort: {createdAt: -1}}).fetch(),
      incompleteTasksCount: CTasks.find({checked: {$ne: true}}).count(),
      user: Meteor.user(),
    });
  });

  if (!user) {
    return (
      <div className="simple-todos-react">
        <LoginForm/>
      </div>
    );
  }

  return (
        
    <div className="simple-todos-react">
      <h1>Todo List ({ incompleteTasksCount })</h1>

      <div className="filters">
        <label>
          <input
              type="checkbox"
              readOnly
              checked={ Boolean(hideCompleted) }
              onClick={() => setHideCompleted(!hideCompleted)}
          />
          Hide Completed
        </label>
      </div>

      <ul className="tasks">
        { tasks.map(task => <Task
          key={ task._id }
          task={ task }
          onCheckboxClick={toggleChecked}
          onDeleteClick={deleteTask}
          onTogglePrivateClick={togglePrivate}
        />) }
      </ul>

      <TaskForm />
    </div>
  );
};
