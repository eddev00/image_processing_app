import { create } from 'zustand'

export const morphStore = create((set) => ({
    morphOp: {
        name: "",
        settings: {
            kernelSize: 3,
            kernelShape: "cross",
            iterations: 1,
            morphType: null,
        },
    },
    updateMorphOp: (newMode, newSettings) => set({
        morphOp: { name: newMode, settings: newSettings } 
        }),
  
 
}))
