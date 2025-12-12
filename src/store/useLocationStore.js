import { create } from 'zustand';

const useLocationStore = create((set) => ({
    selectedLocation: null, // { locationId, country, city, office }
    setSelectedLocation: (location) => set({ selectedLocation: location }),
}));

export default useLocationStore;
