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
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { list: list };
  }
  render() {
    const helloworld = "wWelcome to the road to learn React!";
    return (
      <div className="App">
        <h2>{helloworld}</h2>
        {this.state.list.map(item => (
          <div key={item.objectId}>
            <span>
              <a href={item.url}></a>
            </span>
            <span>{item.author}</span>
            <span>{item.title}</span>
            <span>{item.Points}</span>
            <span>{item.num_comments}</span>
          </div>
        ))}
      </div>
    );
  }
}
export default App;
