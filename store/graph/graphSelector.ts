import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store";

const graphReducerSelector = ({ graph }: RootState) => graph;

export const graphModeSelector = createSelector(
  [graphReducerSelector],
  ({ mode }) => mode
);

export const graphNodesSelector = createSelector(
  [graphReducerSelector],
  ({ nodes }) => nodes
);

export const newEdgeNodesSelector = createSelector(
  [graphReducerSelector],
  ({ newEdgeNodes }) => newEdgeNodes
);
