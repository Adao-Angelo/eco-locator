import { create } from "zustand";

interface RecyclingPoint {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  materials: string[];
  operating_hours: string;
  contact: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

type MaterialType =
  | "plastic"
  | "glass"
  | "electronics"
  | "paper"
  | "metal"
  | "batteries";

interface DashboardState {
  user: any | null;
  recyclingPoints: RecyclingPoint[];
  loading: boolean;
  search: string;
  materialFilter: string;
  statusFilter: string;
  openModal: boolean;
  selectedMaterials: MaterialType[];
  submitting: boolean;
  formData: {
    name: string;
    address: string;
    latitude: string;
    longitude: string;
    operating_hours: string;
    contact: string;
    status: "active" | "inactive";
  };

  setUser: (user: any) => void;
  setRecyclingPoints: (points: RecyclingPoint[]) => void;
  setLoading: (loading: boolean) => void;
  setSearch: (search: string) => void;
  setMaterialFilter: (filter: string) => void;
  setStatusFilter: (filter: string) => void;
  setOpenModal: (open: boolean) => void;
  setSelectedMaterials: (materials: MaterialType[]) => void;
  setSubmitting: (submitting: boolean) => void;
  setFormData: (formData: Partial<DashboardState["formData"]>) => void;
  resetForm: () => void;
  addRecyclingPoint: (point: RecyclingPoint) => void;
  removeRecyclingPoint: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  user: null,
  recyclingPoints: [],
  loading: true,
  search: "",
  materialFilter: "all",
  statusFilter: "all",
  openModal: false,
  selectedMaterials: [],
  submitting: false,
  formData: {
    name: "",
    address: "",
    latitude: "-8.81654518708879",
    longitude: "13.231914158549538",
    operating_hours: "08:00-18:00",
    contact: "",
    status: "active",
  },

  setUser: (user) => set({ user }),
  setRecyclingPoints: (recyclingPoints) => set({ recyclingPoints }),
  setLoading: (loading) => set({ loading }),
  setSearch: (search) => set({ search }),
  setMaterialFilter: (materialFilter) => set({ materialFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setOpenModal: (openModal) => set({ openModal }),
  setSelectedMaterials: (selectedMaterials) => set({ selectedMaterials }),
  setSubmitting: (submitting) => set({ submitting }),
  setFormData: (newFormData) =>
    set((state) => ({
      formData: { ...state.formData, ...newFormData },
    })),
  resetForm: () =>
    set({
      formData: {
        name: "",
        address: "",
        latitude: "-8.81654518708879",
        longitude: "13.231914158549538",
        operating_hours: "08:00-18:00",
        contact: "",
        status: "active",
      },
      selectedMaterials: [],
    }),
  addRecyclingPoint: (point) =>
    set((state) => ({
      recyclingPoints: [point, ...state.recyclingPoints],
    })),
  removeRecyclingPoint: (id) =>
    set((state) => ({
      recyclingPoints: state.recyclingPoints.filter((point) => point.id !== id),
    })),
}));
