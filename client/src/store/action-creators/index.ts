import * as UserActionCreators from "./users";
import * as TodoActionCreators from "./todos";

export default {
  ...UserActionCreators,
  ...TodoActionCreators,
};
