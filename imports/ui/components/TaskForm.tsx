import React, {useState} from 'react';

export const TaskForm = () => {
  const [text, setText] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!text) return;

    Meteor.call('tasks.insert', text.trim(), content.trim());

    setText("");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type to add new tasks"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <textarea value={content} onChange={(e) => setContent(e.target.value)}/>
        

      <button type="submit">Add Task</button>
    </form>
  );
};
