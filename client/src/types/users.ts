export interface UserState {
  users: [];
  loading: boolean;
  errors: string | null;
}

export enum UserActionTypes {
  FETCH_USERS = "FETCH_USERS",
  FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS",
  FETCH_USERS_ERROR = "FETCH_USERS_ERROR",
}

interface FetchUsersAction {
  type: UserActionTypes.FETCH_USERS;
}

interface FetchUsersActionSuccess {
  type: UserActionTypes.FETCH_USERS_SUCCESS;
  payload: [];
}

interface FetchUsersActionError {
  type: UserActionTypes.FETCH_USERS_ERROR;
  payload: string;
}

export type UserAction =
  | FetchUsersAction
  | FetchUsersActionSuccess
  | FetchUsersActionError;
