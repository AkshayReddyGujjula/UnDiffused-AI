import cv2
import numpy as np
import os

def create_icon(size):
    # Create dark glass background
    img = np.zeros((size, size, 4), dtype=np.uint8)
    
    # Center and radius
    center = (size // 2, size // 2)
    radius = size // 2 - 2
    
    # Draw glass circle (semi-transparent blue-ish)
    # BGRA color
    cv2.circle(img, center, radius, (50, 50, 50, 100), -1, cv2.LINE_AA)
    
    # Draw border (white-ish)
    cv2.circle(img, center, radius, (255, 255, 255, 200), max(1, size // 20), cv2.LINE_AA)
    
    # Draw "Scanner" laser line
    # Gradient-like line in the middle
    p1 = (size // 4, size // 2)
    p2 = (size * 3 // 4, size // 2)
    cv2.line(img, p1, p2, (255, 100, 100, 255), max(1, size // 10), cv2.LINE_AA)
    
    # Draw glow (simple stacking of lines)
    cv2.line(img, p1, p2, (255, 50, 50, 150), max(1, size // 5), cv2.LINE_AA)

    return img

def main():
    sizes = [16, 48, 128]
    # Use relative path from the script location
    # Assumes script is in /scripts and icons should be in /icons
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    output_dir = os.path.join(project_root, "icons")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        print(f"Created icons directory: {output_dir}")
        
    for size in sizes:
        # Create a simple colored square with text for now if cv2 fails or for simplicity
        # But we'll try to use the create_icon logic
        try:
            icon = create_icon(size)
            filename = os.path.join(output_dir, f"icon{size}.png")
            cv2.imwrite(filename, icon)
            print(f"Generated {filename}")
        except Exception as e:
            print(f"Failed to generate icon size {size}: {e}")

if __name__ == "__main__":
    main()
