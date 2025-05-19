import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Visualization } from "@/types";

interface InitialState {
  isAnimationModeEnabled: boolean;
  visualization: Visualization;
  frameActionIndex: number;
}

const initialState: InitialState = {
  isAnimationModeEnabled: false,
  frameActionIndex: 0,
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
    setFrameActionIndex: (state, { payload }: PayloadAction<number>) => {
      state.frameActionIndex = payload;
    },
  },
});

export const { setMode, setFrameActionIndex, setVisualization } =
  visualizationSlice.actions;
