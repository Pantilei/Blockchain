import React from "react";
import TodoList from "./components/TodoList";
import UsersList from "./components/UsersList";

const App: React.FC = () => {
  return (
    <div className="App">
      <UsersList />
      <hr />
      <TodoList />
    </div>
  );
};

export default App;
