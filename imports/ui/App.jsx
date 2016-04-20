import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import AccountsUIWrapper from './AccountsUIWrapper.jsx'
import { Tasks } from '../api/tasks.js';

import Task from './Task.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
   
    Meteor.call('tasks.insert',text);
    
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  
  toggleHideCompleted() {
    this.setState({
      hideCompleted : !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let taasks = this.props.tasks;
    let filteredTasks = null;
    if(this.state.hideCompleted) {
      filteredTasks = taasks.filter(task => !task.checked);
    }
    else {
      filteredTasks = taasks;
    }
    filteredTasks = filteredTasks.filter(task => (task.username == this.props.currentUser.username));
    return filteredTasks.map((task) => {
	const showPrivateButton = task.owner === (this.props.currentUser && this.props.currentUser._id);
	return(<Task key={task._id} task={task} showPrivateButton={showPrivateButton}/>)
     });
  }

  render() {
    return (
	  <div className='container'>
 	  <header>  <AccountsUIWrapper /> </header>
	    { this.props.currentUser ? 
	      <div>
	      <header>
	        <h1> Todo </h1>
	        <label className='hide-completed'>
		  <input type='checkbox' readOnly checked={this.state.hideCompleted} onClick={this.toggleHideCompleted.bind(this)} />
		  Hide Completed Task
	        </label>
	        <form className='task-submit' onSubmit={this.handleSubmit.bind(this)} >
	       	    <input type='text' ref='textInput' placeholder='Enter a todo item..' />
	        </form>
	      </header>
	      <ul>
	        { this.renderTasks() }
 	      </ul>
	      </div> : <header>Please Sign In </header>
	    }
	  </div>

        );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
}

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({ }, { sort: {createdAt: -1} }).fetch(),
    currentUser: Meteor.user(),
  };
}, App);
