import React, { Component } from "react";
import "./App.css";
const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const URL = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;

const largeColumn = {
  width: "40"
};
const midColumn = { width: "30%" };
const smallColumn = {
  width: "10%"
};

// higher order fuction
const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());
// the app component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.onSearchTopStories = this.onSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  onSearchTopStories(result) {
    this.setState({ result });
  }
  // this is a component lifecylce method for fething data.
  componentDidMount() {
    const { searchTerm } = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.onSearchTopStories(result))
      .catch(error => error);
  }

  onDismiss(id) {
    const isNotId = item => item.objectId !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, result } = this.state;
    console.log(this.state);
    if (!result) {
      return null;
    }
    return (
      <div className="page">
        <div className="interacions">
          <Search value={searchTerm} onChange={this.onSearchChange} />
        </div>
        {result && (
          <Table
            list={result.hits}
            pattern={searchTerm}
            onDismiss={this.onDismiss}
          />
        )}
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
    <div className="table">
      {list.filter(isSearched(pattern)).map(item => (
        <div key={item.objectId} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}></a>
          </span>
          <span style={midColumn}>{item.author}</span>
          <span style={smallColumn}>{item.num_comments}</span>
          <span style={smallColumn}>{item.Points}</span>
          <span style={smallColumn}>
            <button
              onClick={() => onDismiss(item.objectId)}
              className="button-inline"
            >
              Dismiss
            </button>
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
