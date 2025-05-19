import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/store";

const visualizationReducerSelector = ({ visualization }: RootState) =>
  visualization;

export const isAnimationModeEnabledSelector = createSelector(
  [visualizationReducerSelector],
  ({ isAnimationModeEnabled }) => isAnimationModeEnabled
);

export const visualizationSelector = createSelector(
  [visualizationReducerSelector],
  ({ visualization }) => visualization
);
