import React, { Component, PropTypes} from 'react';
import { Tasks } from '../api/tasks.js';

export default class Task extends Component {
  toggleChecked() {
    Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
  }
  deleteThisTask() {
    Meteor.call('tasks.remove', this.props.task._id);
  }
  togglePrivate() {
    Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
  }
  render() {
    const taskClassName = this.props.task.checked ? 'checked' : '';
    return (
	<li className={taskClassName}>
          <button className="delete" onClick={this.deleteThisTask.bind(this)}>
          &times;
        </button>
        <input type='checkbox' readonly checked={this.props.task.checked} onClick={this.toggleChecked.bind(this)} />
        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.task.private ? 'Private' : 'Public' }
          </button>
        ) : ''}
        <span className='text'>{this.props.task.text}</span>
        </li>
      );
  }
}

Task.propTypes = {
    task: PropTypes.object.isRequired,  
    showPrivateButton: React.PropTypes.bool.isRequired,
};
