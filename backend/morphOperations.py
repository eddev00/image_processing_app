import numpy as np
from PIL import Image

def create_kernel(kernel_size, kernel_shape):
    if kernel_shape == 'rect':
        return np.ones((kernel_size, kernel_size), dtype=np.uint8)
    elif kernel_shape == 'cross':
        kernel = np.zeros((kernel_size, kernel_size), dtype=np.uint8)
        center = kernel_size // 2
        kernel[center, :] = 1
        kernel[:, center] = 1
        return kernel
    elif kernel_shape == 'ellipse':
        center = kernel_size // 2
        kernel = np.zeros((kernel_size, kernel_size), dtype=np.uint8)
        for i in range(kernel_size):
            for j in range(kernel_size):
                if ((i - center) ** 2 + (j - center) ** 2) <= (center ** 2):
                    kernel[i, j] = 1
        return kernel
    else:
        raise ValueError("Invalid kernel shape")

def erode_image(image, kernel, iterations=1):
    image_height, image_width = image.shape
    kernel_height, kernel_width = kernel.shape
    pad_height = kernel_height // 2
    pad_width = kernel_width // 2
    padded_image = np.pad(image, ((pad_height, pad_height), (pad_width, pad_width)), mode='constant', constant_values=0)
    eroded_image = np.copy(image)

    for _ in range(iterations):
        temp_image = np.zeros_like(eroded_image)
        for i in range(image_height):
            for j in range(image_width):
                region = padded_image[i:i + kernel_height, j:j + kernel_width]
                temp_image[i, j] = np.min(region[kernel == 1])
        eroded_image = temp_image
        padded_image = np.pad(eroded_image, ((pad_height, pad_height), (pad_width, pad_width)), mode='constant', constant_values=0)
    
    return eroded_image

def dilate_image(image, kernel, iterations=1):
    image_height, image_width = image.shape
    kernel_height, kernel_width = kernel.shape
    pad_height = kernel_height // 2
    pad_width = kernel_width // 2
    padded_image = np.pad(image, ((pad_height, pad_height), (pad_width, pad_width)), mode='constant', constant_values=0)
    dilated_image = np.copy(image)

    for _ in range(iterations):
        temp_image = np.zeros_like(dilated_image)
        for i in range(image_height):
            for j in range(image_width):
                region = padded_image[i:i + kernel_height, j:j + kernel_width]
                temp_image[i, j] = np.max(region[kernel == 1])
        dilated_image = temp_image
        padded_image = np.pad(dilated_image, ((pad_height, pad_height), (pad_width, pad_width)), mode='constant', constant_values=0)
    
    return dilated_image

def open_image(image, kernel, iterations=1):
    eroded_image = erode_image(image, kernel, iterations)
    opened_image = dilate_image(eroded_image, kernel, iterations)
    return opened_image

def close_image(image, kernel, iterations=1):
    dilated_image = dilate_image(image, kernel, iterations)
    closed_image = erode_image(dilated_image, kernel, iterations)
    return closed_image
