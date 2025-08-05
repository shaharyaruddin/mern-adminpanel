import { FETCH_ACTION_STATE } from "../states/FetchActionState";
import { FETCH_INITIAL_STATE } from "../states/FetchInitialState";

export const fetchReducer = (state,action)=>{
  switch(action.type){
    case FETCH_ACTION_STATE.FETCH_START:
      return {
          LOADING:true,
          DATA:{},
          ERROR:false
      }
    case FETCH_ACTION_STATE.FETCH_SUCCESS:
      return {
        ...state,
          LOADING:false,
          DATA:action.payload,
          ERROR:false
      }
    case FETCH_ACTION_STATE.FETCH_ERROR:
      return {
          LOADING:false,
          DATA:{},
          ERROR:true
      }
      default:
        return {
           LOADING:false,
          DATA:{},
          ERROR:true
        };
  }
}