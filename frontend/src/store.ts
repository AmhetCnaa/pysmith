import { create } from 'zustand';

export interface Widget {
  id: string;
  type: "BUTTON" | "TEXT" | "TABLE" | "INPUT";
  x: number;
  y: number;
  w: number;
  h: number;
  props: Record<string, any>;
}

interface AppState {
  widgets: Widget[];
  selectedWidgetId: string | null;
  dataTree: Record<string, any>;
  addWidget: (widget: Widget) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  updateWidgetProp: (id: string, key: string, value: any) => void;
  setSelectedWidgetId: (id: string | null) => void;
  setDataTree: (tree: Record<string, any>) => void;
  evaluateDataTree: () => void;
}

let evalWorker: Worker;
if (typeof window !== 'undefined') {
  evalWorker = new Worker(new URL('./workers/evalWorker.ts', import.meta.url), { type: 'module' });
}

export const useStore = create<AppState>((set, get) => {
  if (typeof window !== 'undefined') {
    evalWorker.onmessage = (e) => {
      set({ dataTree: e.data });
    };
  }

  return {
    widgets: [],
    selectedWidgetId: null,
    dataTree: {},
    addWidget: (widget) => {
      set((state) => ({ widgets: [...state.widgets, widget] }));
      get().evaluateDataTree();
    },
    updateWidget: (id, updates) => {
      set((state) => ({
        widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w)),
      }));
      get().evaluateDataTree();
    },
    updateWidgetProp: (id, key, value) => {
      set((state) => ({
        widgets: state.widgets.map((w) =>
          w.id === id ? { ...w, props: { ...w.props, [key]: value } } : w
        ),
      }));
      get().evaluateDataTree();
    },
    setSelectedWidgetId: (id) => set({ selectedWidgetId: id }),
    setDataTree: (tree) => set({ dataTree: tree }),
    evaluateDataTree: () => {
      const { widgets } = get();
      const unparsedTree: Record<string, any> = {};
      
      widgets.forEach((w) => {
        unparsedTree[w.id] = { ...w.props, _type: w.type };
      });

      // Mock API for Evaluation engine test
      unparsedTree['Api1'] = { data: { name: 'John Doe', role: 'Admin' } };

      evalWorker.postMessage({ unparsedTree });
    },
  };
});
