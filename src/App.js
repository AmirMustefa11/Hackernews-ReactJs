import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { sortBy } from "lodash";
import classNames from "classnames";
const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "100";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";
//const URL = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

const largeColumn = {
  width: "40%"
};
const midColumn = {
  width: "30%"
};
const smallColumn = {
  width: "10%"
};

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, "title"),
  AUTHOR: list => sortBy(list, "author"),
  COMMENTS: list => sortBy(list, "num_comments").reverse(),
  POINTS: list => sortBy(list, "points").reverse()
};

const updatedSearchTopStoriesState =(hits,page) =>(prevState) =>{
  const {searchKey,results} = prevState;
  const oldHits = results && results[searchKey]? results[searchKey].hits : [];
  const updatedHits = [...oldHits,...hits];
  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false

  }

}

// the app component
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
      
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
     
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }
  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  // We want to concatenate the old and new list of hits from the local state and new result object,
  // so we’ll adjust its functionality to add new data rather than override it.
  setSearchTopStories(result) {
    //to cache from the client side First, get the hits and page from the result.
    const { hits, page } = result;

    //to store each result by search key
    
    this.setState(
        updatedSearchTopStoriesState(hits,page)
    )

  }
  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true });
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this.setState({ error }));
  }

  // this is a component lifecylce method for fething data.
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }
    event.preventDefault();
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
      sortKey,
      isSortReverse
    } = this.state;

    //make sure to default to page 0 when there is no result.and also
    // Remember, the render() method is called before the data is fetched asynchronously in the componentDidMount() lifecycle method.
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        {error ? (
          <div className="interactions">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        )}

        <div className="interactions">
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
            >
              More
            </Button>
          )}
        </div>
      </div>
    );
  }
}
//Search  Componenet
const Search = ({ value, onChange, onSubmit, children }) => (
  <form onSubmit={onSubmit}>
    <input type="text" value={value} onChange={onChange} />
    <button type="submit">{children}</button>
  </form>
);




// // Table with class component

class Table extends Component{
  constructor(props){
    super(props);
    this.state = {
      sortKey : 'NONE',
      isSortReverse : false,
    }
    this.onSort = this.onSort.bind(this);

  }
  onSort(sortKey){
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({sortKey,isSortReverse});

  }
  render(){
    const {
      list,
      onDismiss
    } = this.props;

    const {
          sortKey,
          isSortReverse
    } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
          <div className="table">
            <div className="table-header">
              <span style={{ width: "40%" }}>
                <Sort sortKey={"TITLE"}
                 onSort={this.onSort} 
                 activeSortKey={sortKey}>
                  Title
                </Sort>
              </span>
              <span style={{ width: "30%" }}>
                <Sort sortKey={"AUTHOR"}
                 onSort={this.onSort} 
                 activeSortKey={sortKey}>
                  Author
                </Sort>
              </span>
              <span style={{ width: "10%" }}>
                <Sort sortKey={"COMMENTS"} onSort={this.onSort} activeSortKey={sortKey}>
                  Comments
                </Sort>
              </span>
              <span style={{ width: "10%" }}>
                <Sort sortKey={"POINTS"} onSort={this.onSort} activeSortKey={sortKey}>
                  Points
                </Sort>
              </span>
              <span style={{ width: "10%" }}>Archieve</span>
            </div>
      
            {reverseSortedList.map(item => (
              <div key={item.objectID} className="table-row">
                <span style={largeColumn}>
                  <a href={item.url}>{item.title}</a>
                </span>
                <span style={midColumn}>{item.author}</span>
                <span style={smallColumn}>{item.num_comments}</span>
                <span style={smallColumn}>{item.points}</span>
                <span style={smallColumn}>
                  <Button
                    onClick={() => onDismiss(item.objectID)}
                    className="button-inline"
                  >
                    Dismiss
                  </Button>
                </span>
              </div>
            ))}
          </div>
        );
  }
}

// Button component
const Button = ({ onClick, className, children }) => (
  <button onClick={onClick} className={className} type="button">
    {children}
  </button>
);
// Sort component
const Sort = ({ sortKey, activeSortKey, onSort, children }) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey === activeSortKey
  });
  return (
    <Button onClick={() => onSort(sortKey)} className={sortClass}>
      {children}
    </Button>
  );
};


const Loading = () => <div>Loading ...</div>;

export default App;
export { Button, Search, Table };

