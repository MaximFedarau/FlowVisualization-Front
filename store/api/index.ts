import { GraphEdge, GraphNode, Visualization } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
  setVisualization,
  setMode,
  setFrameActionIndex,
} from "@/store/visualization";
import { actualizeNodesPositions } from "../graph";

const formatEdges = (edges: GraphEdge[]) => {
  const old_indexes: number[] = [];

  for (const edge of edges) {
    if (old_indexes.indexOf(edge.from_id) === -1) {
      old_indexes.push(edge.from_id);
    }
    if (old_indexes.indexOf(edge.to_id) === -1) {
      old_indexes.push(edge.to_id);
    }
  }

  old_indexes.sort((a, b) => a - b);

  const new_indexes: { [key: number]: number } = {};
  const rev_new_indexes: { [key: number]: number } = {};
  for (let index = 1; index <= old_indexes.length; index += 1) {
    new_indexes[old_indexes[index - 1]] = index - 1;
    rev_new_indexes[index - 1] = old_indexes[index - 1];
  }

  return {
    rev_index_table: rev_new_indexes,
    new_edges: edges.map((edge) => ({
      from_: new_indexes[edge.from_id],
      to: new_indexes[edge.to_id],
      capacity: edge.capacity,
      flow: 0,
      color: [0, 0, 0],
    })),
  };
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.BACKEND_URL}/` }),
  endpoints: (builder) => ({
    getVisualization: builder.query<
      Visualization,
      { algorithm: string; nodes: GraphNode[]; edges: GraphEdge[] }
    >({
      async queryFn(
        { algorithm, nodes, edges },
        { dispatch },
        _extraProps,
        fetchWithBQ
      ) {
        const { new_edges, rev_index_table } = formatEdges(edges);
        const visualizationResponse = await fetchWithBQ({
          url: `${algorithm}/generate`,
          method: "post",
          body: {
            n: nodes.length,
            m: edges.length,
            edges: new_edges,
          },
        });

        if (visualizationResponse.error)
          return { error: visualizationResponse.error };

        const visualization = visualizationResponse.data as Visualization;
        visualization.visualization = visualization.visualization.map(
          (action) => {
            const new_action = action;
            new_action.way = action.way.map((current_way) => {
              const new_way = current_way;
              new_way.from_ = rev_index_table[new_way.from_];
              new_way.to = rev_index_table[new_way.to];
              return new_way;
            });
            return new_action;
          }
        );

        dispatch(setVisualization(visualizationResponse.data as Visualization));
        dispatch(setFrameActionIndex(0));
        dispatch(actualizeNodesPositions());
        dispatch(setMode(true));
        return {
          data: visualization,
        };
      },
    }),
  }),
});

export const { useLazyGetVisualizationQuery } = api;
