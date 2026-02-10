import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const STORAGE_KEY = 'gameapp:selectedLocation';

const useLocationStore = create(
    persist(
        (set) => ({
            selectedLocation: null, // { locationId, country, city, office }
            setSelectedLocation: (location) => set({ selectedLocation: location ?? null }),
            clearSelectedLocation: () => set({ selectedLocation: null }),
        }),
        {
            name: STORAGE_KEY,
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ selectedLocation: state.selectedLocation }),
        }
    )
);

export default useLocationStore;
