import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { GraphNode, MODES, KonvaNode, GraphEdge } from "@/types";

interface InitialState {
  mode: MODES;
  nodes: GraphNode[];
  newEdgeNodes: number[];
  edges: GraphEdge[];
  idCounter: number;
}

const initialState: InitialState = {
  mode: MODES.DEFAULT,
  nodes: [],
  newEdgeNodes: [],
  edges: [],
  idCounter: 0,
};

const findNodeIndex = (
  nodes: GraphNode[],
  comp: (a: number, b: number) => boolean
) => {
  let res = 0;
  for (let index = 0; index < nodes.length; index += 1) {
    if (comp(nodes[res].id, nodes[index].id)) {
      res = index;
    }
  }
  return res;
};

export const graphSlice = createSlice({
  name: "graphSlice",
  initialState,
  reducers: {
    setMode: (state, { payload: newMode }: PayloadAction<MODES>) => {
      state.mode = newMode;
    },
    addNode: (state, { payload: { x, y } }: PayloadAction<KonvaNode>) => {
      const new_node: GraphNode = {
        x,
        y,
        actualX: x,
        actualY: y,
        is_source: state.nodes.length === 0,
        is_sink: true,
        id: state.idCounter,
      };

      state.idCounter += 1;

      if (state.nodes.length >= 1) {
        const prevSinkIndex = findNodeIndex(
          state.nodes,
          (a: number, b: number) => a < b
        );
        state.nodes[prevSinkIndex].is_sink = false;
      }

      state.nodes.push(new_node);
    },
    removeNode: (state, { payload }: PayloadAction<number>) => {
      const removedNode = state.nodes.find((node) => node.id === payload);

      if (!removedNode) {
        return;
      }

      state.nodes = state.nodes.filter((node) => node.id !== payload);
      state.idCounter += 1;

      state.edges = state.edges.filter(
        (edge) =>
          edge.from_id !== removedNode.id && edge.to_id !== removedNode.id
      );

      if (state.nodes.length === 0) {
        return;
      }

      if (removedNode.is_sink) {
        const newSinkIndex = findNodeIndex(
          state.nodes,
          (a: number, b: number) => a < b
        );
        state.nodes[newSinkIndex].is_sink = true;
      }

      if (removedNode.is_source) {
        const newSinkIndex = findNodeIndex(
          state.nodes,
          (a: number, b: number) => a > b
        );
        state.nodes[newSinkIndex].is_source = true;
      }
    },
    updateNodePosition: (
      state,
      {
        payload: { id, x, y },
      }: PayloadAction<{ x: number; y: number; id: number }>
    ) => {
      const updatedNodeIndex = state.nodes.findIndex((node) => node.id === id);

      if (updatedNodeIndex === -1) {
        return;
      }

      state.nodes[updatedNodeIndex].actualX = x;
      state.nodes[updatedNodeIndex].actualY = y;
    },
    addNewEdgeNode: (state, { payload }: PayloadAction<number>) => {
      state.newEdgeNodes.push(payload);
    },
    clearNewEdgeNodes: (state) => {
      state.newEdgeNodes = [];
    },
    addEdge: (state, { payload }: PayloadAction<Omit<GraphEdge, "id">>) => {
      state.edges.push({ ...payload, id: state.idCounter });
      state.idCounter += 1;
    },
  },
});

export const {
  setMode,
  addNode,
  removeNode,
  updateNodePosition,
  addNewEdgeNode,
  clearNewEdgeNodes,
  addEdge,
} = graphSlice.actions;
