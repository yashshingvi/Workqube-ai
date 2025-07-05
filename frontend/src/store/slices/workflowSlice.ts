import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  status: 'draft' | 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  organization: string;
  template?: boolean;
}

export interface WorkflowState {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  isLoading: boolean;
  error: string | null;
  selectedNode: string | null;
  executionStatus: Record<string, 'idle' | 'running' | 'completed' | 'failed'>;
}

const initialState: WorkflowState = {
  workflows: [],
  currentWorkflow: null,
  isLoading: false,
  error: null,
  selectedNode: null,
  executionStatus: {},
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setWorkflows: (state, action: PayloadAction<Workflow[]>) => {
      state.workflows = action.payload;
    },
    addWorkflow: (state, action: PayloadAction<Workflow>) => {
      state.workflows.push(action.payload);
    },
    updateWorkflow: (state, action: PayloadAction<Workflow>) => {
      const index = state.workflows.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workflows[index] = action.payload;
      }
    },
    deleteWorkflow: (state, action: PayloadAction<string>) => {
      state.workflows = state.workflows.filter(w => w.id !== action.payload);
    },
    setCurrentWorkflow: (state, action: PayloadAction<Workflow | null>) => {
      state.currentWorkflow = action.payload;
    },
    updateWorkflowNodes: (state, action: PayloadAction<{ workflowId: string; nodes: WorkflowNode[] }>) => {
      if (state.currentWorkflow?.id === action.payload.workflowId) {
        state.currentWorkflow.nodes = action.payload.nodes;
      }
    },
    updateWorkflowEdges: (state, action: PayloadAction<{ workflowId: string; edges: WorkflowEdge[] }>) => {
      if (state.currentWorkflow?.id === action.payload.workflowId) {
        state.currentWorkflow.edges = action.payload.edges;
      }
    },
    setSelectedNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = action.payload;
    },
    setExecutionStatus: (state, action: PayloadAction<{ nodeId: string; status: 'idle' | 'running' | 'completed' | 'failed' }>) => {
      state.executionStatus[action.payload.nodeId] = action.payload.status;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setWorkflows,
  addWorkflow,
  updateWorkflow,
  deleteWorkflow,
  setCurrentWorkflow,
  updateWorkflowNodes,
  updateWorkflowEdges,
  setSelectedNode,
  setExecutionStatus,
  setLoading,
  setError,
} = workflowSlice.actions;

export default workflowSlice.reducer; 