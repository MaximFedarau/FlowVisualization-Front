import { combineReducers } from "@reduxjs/toolkit";

import { graphSlice } from "./graph";
import { visualizationSlice } from "./visualization";
import { api } from "./api";

export const rootReducer = combineReducers({
  graph: graphSlice.reducer,
  visualization: visualizationSlice.reducer,
  [api.reducerPath]: api.reducer,
});
