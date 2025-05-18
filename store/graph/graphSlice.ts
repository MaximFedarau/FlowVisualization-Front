import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { MODES } from "@/types";

interface InitialState {
  mode: MODES;
}

const initialState: InitialState = {
  mode: MODES.DEFAULT,
};

export const graphSlice = createSlice({
  name: "graphSlice",
  initialState,
  reducers: {
    setMode: (state, { payload: newMode }: PayloadAction<MODES>) => {
      state.mode = newMode;
    },
  },
});

export const { setMode } = graphSlice.actions;
