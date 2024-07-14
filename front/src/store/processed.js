import { create } from 'zustand'

export const prStore = create((set) => ({
    pr:  {
        path: null,
    },
    updatePr: (path) => set({
        pr: {
            path: path,
        }
        }),
  
 
}))
