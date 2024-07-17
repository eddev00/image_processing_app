import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage.morphology import skeletonize

def skeletonize_image(input_path, output_path, threshold):
    image = cv2.imread(input_path, cv2.IMREAD_GRAYSCALE)

    # Apply a binary threshold to get a binary image
    _, binary_image = cv2.threshold(image, threshold, 255, cv2.THRESH_BINARY)

    # Invert the binary image to have the foreground as white
    binary_image = cv2.bitwise_not(binary_image)

    # Remove small white regions using morphological opening
    kernel = np.ones((9, 9), np.uint8)
    binary_image = cv2.morphologyEx(binary_image, cv2.MORPH_OPEN, kernel)

    # Remove small black regions using morphological closing
    binary_image = cv2.morphologyEx(binary_image, cv2.MORPH_CLOSE, kernel)

    # Perform skeletonization
    skeleton = skeletonize(binary_image / 255)

    # Convert the skeleton to uint8
    skeleton = (skeleton * 255).astype(np.uint8)

    cv2.imwrite(output_path, skeleton)
    return output_path
