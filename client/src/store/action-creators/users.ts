import axios from "axios";
import { Dispatch } from "react";
import { UserAction, UserActionTypes } from "../../types/users";

export const fetchUsers = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      dispatch({ type: UserActionTypes.FETCH_USERS });
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setTimeout(() => {
        dispatch({
          type: UserActionTypes.FETCH_USERS_SUCCESS,
          payload: response.data,
        });
      }, 1000);
    } catch {
      dispatch({
        type: UserActionTypes.FETCH_USERS_ERROR,
        payload: "Error occured when fetching the users",
      });
    }
  };
};
