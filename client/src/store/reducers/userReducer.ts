import { UserState, UserAction, UserActionTypes } from "../../types/users";

const initialState: UserState = {
  users: [],
  loading: false,
  errors: null,
};

export const userReducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case UserActionTypes.FETCH_USERS:
      return { users: [], errors: null, loading: true };
    case UserActionTypes.FETCH_USERS_SUCCESS:
      return { loading: false, errors: null, users: action.payload };
    case UserActionTypes.FETCH_USERS_ERROR:
      return { loading: false, users: [], errors: action.payload };
    default:
      return state;
  }
};
