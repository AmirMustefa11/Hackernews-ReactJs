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

    return (
      <div className="App">
        <Search value={searchTerm} onChange={this.onSearchChange} />
        <Table list={list} pattern={searchTerm} onDismiss={this.onDismiss} />
      </div>
    );
  }
}

const Search = ({ value, onChange, children }) => {
  return (
    <form>
      {children}
      <input type="text" value={value} onChange={onChange} />
    </form>
  );
};

const Table = ({ list, pattern, onDismiss }) => {
  return (
    <div className="App">
      {list.filter(isSearched(pattern)).map(item => (
        <div key={item.objectId}>
          <span>
            <a href={item.url}>{item.title}></a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.Points}</span>
          <span>
            <button onClick={() => onDismiss(item.objectId)}>Dismiss</button>
          </span>
        </div>
      ))}
    </div>
  );
};

const Button = ({ onClick, className = "", children }) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};
export default App;
