import React, { Component } from "react";
import "./App.css";
class App extends Component {
  render() {
    var helloWorld =
      "welcome to the road to learn React Amir and its students  * his :)";
    return (
      <div className="App">
        <h2>{helloWorld}</h2>
      </div>
    );
  }
}
export default App;
