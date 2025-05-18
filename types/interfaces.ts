export interface KonvaNode {
  x: number;
  y: number;
}

export interface GraphNode {
  x: number;
  y: number;
  id: number;
  is_source: boolean;
  is_sink: boolean;
}
