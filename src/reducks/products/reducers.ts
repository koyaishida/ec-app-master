import {Actions, ActionTypes} from "./actions"
import initialState from "../store/initialState"



export const ProductsReducer = (state = initialState.products, action:Actions) => {
  switch (action.type){
    case ActionTypes.FETCH_PRODUCTS:
      return {
        ...state,
        list:[...action.payload]
      }
    case ActionTypes.DELETE_PRODUCTS:
      return {
        ...state,
        list:[...action.payload]
      }
     default: 
       return state
  }
}



