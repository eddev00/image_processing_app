import { create } from 'zustand'

export const modeStore = create((set) => ({
    mode: {
        name: "",
        settings: "",
    },
    updateMode: (newMode, newSettings) => set({
         mode: { name: newMode, settings: newSettings } 
        }),
  
 
}))
