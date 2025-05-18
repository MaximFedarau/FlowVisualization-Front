import { combineReducers } from "@reduxjs/toolkit";

import { graphSlice } from "./graph";

export const rootReducer = combineReducers({
  graph: graphSlice.reducer,
});
