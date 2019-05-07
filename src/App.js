import React, { Component } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { withAuthenticator } from "aws-amplify-react";
import { createTodo, deleteTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";

class App extends Component {
  state = {
    name: "",
    notes: []
  };

  async componentDidMount() {
    const result = await API.graphql(graphqlOperation(listTodos));
    this.setState({ notes: result.data.listTodos.items });
  }

  handleChangeNode = event => this.setState({ name: event.target.value });

  handleAddNote = async event => {
    const { name, notes } = this.state;
    event.preventDefault();
    const input = { name };
    const result = await API.graphql(graphqlOperation(createTodo, { input }));
    const newNote = result.data.createTodo;
    const updatedNotes = [newNote, ...notes];
    this.setState({ notes: updatedNotes, name: "" });
  };

  handleDeleteNote = async nameId => {
    const { notes } = this.state;
    const input = { id: nameId };
    const result = await API.graphql(graphqlOperation(deleteTodo, { input }));
    const deleteTodoId = result.data.deleteTodo.id;
    const updatedNotes = notes.filter(name => name.id !== deleteTodoId);
    this.setState({ notes: updatedNotes });
  };

  render() {
    const { notes, name } = this.state;
    return (
      <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
        <h1 className="code f2-1">NoteTaker</h1>
        {/* {Note form} */}
        <form onSubmit={this.handleAddNote} className="mb3">
          <input
            type="text"
            className="pa2 f4"
            placeholder="Write your note"
            onChange={this.handleChangeNode}
            value={name}
          />
          <button className="pa2 f4" type="submit">
            Add Note
          </button>
        </form>

        {/* {Note list} */}
        <div>
          {notes.map(item => (
            <div key={item.id} className="flex items-center">
              <li className="list pa1 f3">{item.name}</li>
              <button
                onClick={() => this.handleDeleteNote(item.id)}
                className="bg-transparent bn f4"
              >
                <span>&times;</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
