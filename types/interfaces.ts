export interface KonvaNode {
  x: number;
  y: number;
}

export interface GraphNode {
  x: number;
  actualX: number;
  y: number;
  actualY: number;
  id: number;
  is_source: boolean;
  is_sink: boolean;
}

export interface GraphEdge {
  from_id: number;
  to_id: number;
  capacity: number;
  id: number;
}

export interface VisualizationEdge {
  from_: number;
  to: number;
  flow: number;
  capacity: number;
}

export interface VisualizationAction {
  way: VisualizationEdge[];
  flow: number;
}

export interface Visualization {
  visualization: VisualizationAction[];
  flow: number;
}
