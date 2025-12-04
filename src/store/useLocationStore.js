import { create } from 'zustand';

const useLocationStore = create((set) => ({
    selectedLocation: null,
    setSelectedLocation: (location) => set({ selectedLocation: location }),
}));

export default useLocationStore;
