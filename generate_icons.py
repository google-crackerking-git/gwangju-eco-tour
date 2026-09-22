from PIL import Image

def create_icon(input_path, output_path, size, padding=40):
    # Load original
    img = Image.open(input_path).convert("RGBA")
    
    # Calculate target character size
    target_size = size - (padding * 2)
    img.thumbnail((target_size, target_size), Image.Resampling.LANCZOS)
    
    # Create white background square
    background = Image.new('RGB', (size, size), (255, 255, 255))
    
    # Calculate center position
    offset = ((size - img.width) // 2, (size - img.height) // 2)
    
    # Paste using alpha channel as mask
    background.paste(img, offset, mask=img)
    
    # Save
    background.save(output_path, "PNG")

input_file = "d:/gwnagju-eco-tour/public/characters/2. 응용형(여행2).png"

# Generate Next.js app icons (auto-handled)
create_icon(input_file, "d:/gwnagju-eco-tour/app/icon.png", 512, 60)
create_icon(input_file, "d:/gwnagju-eco-tour/app/apple-icon.png", 512, 60)

# Generate PWA explicit icons
create_icon(input_file, "d:/gwnagju-eco-tour/public/icon-192.png", 192, 20)
create_icon(input_file, "d:/gwnagju-eco-tour/public/icon-512.png", 512, 60)

print("Icons generated successfully!")
