import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Visualization } from "@/types";

interface InitialState {
  isAnimationModeEnabled: boolean;
  visualization: Visualization;
}

const initialState: InitialState = {
  isAnimationModeEnabled: false,
  visualization: { visualization: [], flow: 0 },
};

export const visualizationSlice = createSlice({
  name: "visualizationSlice",
  initialState,
  reducers: {
    setMode: (state, { payload }: PayloadAction<boolean>) => {
      state.isAnimationModeEnabled = payload;
    },
    setVisualization: (state, { payload }: PayloadAction<Visualization>) => {
      state.visualization = payload;
    },
  },
});

export const { setMode, setVisualization } = visualizationSlice.actions;
