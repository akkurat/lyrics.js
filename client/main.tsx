import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { LyricsApp } from '../imports/ui/App';

Meteor.startup(() => {
  render(<LyricsApp/>, document.getElementById('react-target'));
});
