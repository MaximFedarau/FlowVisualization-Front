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
