import { create } from 'zustand'

export const imageStore = create((set) => ({
    imagePath:  {
        path: "",
    },
    updatePath: (imagePath) => set({
        imagePath: {
            path: imagePath,
        }
        }),
  
 
}))
