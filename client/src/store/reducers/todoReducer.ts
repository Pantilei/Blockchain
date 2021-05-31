import { TodoAction, TodoActionTypes, TodoState } from "../../types/todo";

const initialState: TodoState = {
  todos: [],
  error: null,
  limit: 10,
  loading: false,
  page: 1,
};

export const todoReducer = (
  state: TodoState = initialState,
  action: TodoAction
): TodoState => {
  switch (action.type) {
    case TodoActionTypes.FETCH_TODOS:
      return { ...state, loading: true };
    case TodoActionTypes.FETCH_TODOS_ERROR:
      return { ...state, error: action.payload, loading: false };
    case TodoActionTypes.FETCH_TODOS_SUCCESS:
      return { ...state, todos: action.payload, loading: false };
    case TodoActionTypes.SET_TODO_PAGE:
      return { ...state, page: action.payload, loading: false };
    default:
      return state;
  }
};
