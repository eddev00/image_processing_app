import { create } from 'zustand'

export const imageStore = create((set) => ({
    imagePath:  {
        path: null,
    },
    updatePath: (imagePath) => set({
        imagePath: {
            path: imagePath,
        }
        }),
  
 
}))
