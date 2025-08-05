import { FETCH_ACTION_STATE } from "../states/FetchActionState";


export const COMBINED_FETCH_INITIAL_STATE = {
  loading: false,
  user: null,
  roles: [],
  error: null,
};

export const combinedFetchReducer = (state, action) => {
  switch (action.type) {
    case FETCH_ACTION_STATE.FETCH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_ACTION_STATE.FETCH_SUCCESS:
      if (action.resource === "user") {
        return {
          ...state,
          loading: false,
          user: action.payload,
          error: null,
        };
      } else if (action.resource === "roles") {
        return {
          ...state,
          loading: false,
          roles: action.payload,
          error: null,
        };
      }
      return state;
    case FETCH_ACTION_STATE.FETCH_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload || "An error occurred",
      };
    default:
      return state;
  }
};

export const COMBINED_FETCH_ACTION_STATE = {
  ...FETCH_ACTION_STATE,
  // No need to extend, reusing FETCH_ACTION_STATE
};