import React, { Component } from "react";
import "./App.css";
const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    Points: 4,
    objectId: 0
  },
  {
    title: "Redux",
    url: "https://redux.js.org",
    author: "Dan Abromov, Andrew Clark",
    num_comments: 5,
    Points: 3,
    objectId: 1
  }
];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { list, searchTerm: "" };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const isNotId = item => item.objectId !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({ list: updatedList });
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { list, searchTerm } = this.state;
    const helloReact = "Welcome to the road to learn React!";
    return (
      <div className="App">
        <h2>{helloReact}</h2>
        <form>
          <input type="text" onChange={this.onSearchChange} />
        </form>
        {list.filter(isSearched(this.state.searchTerm)).map(item => (
          <div key={item.objectId}>
            <span>
              <a href={item.url}></a>
            </span>
            <span>{item.author}</span>
            <span>{item.title}</span>
            <span>{item.Points}</span>
            <span>{item.num_comments}</span>
            <span>
              <button
                onClick={() => this.onDismiss(item.objectId)}
                type="button"
              >
                Dismiss
              </button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}
export default App;
