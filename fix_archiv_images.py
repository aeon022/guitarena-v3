import os
import re

md_dir = 'frontend/src/content/events/archiv'
img_archiv_dir = 'frontend/public/images/events/archiv'

# Hole alle real existierenden Bilder im Archiv-Ordner
real_images = os.listdir(img_archiv_dir)

for filename in os.listdir(md_dir):
    if not filename.endswith('.md'): continue
    
    file_path = os.path.join(md_dir, filename)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Finde den aktuellen Bild-Eintrag
    match = re.search(r'image: "([^"]+)"', content)
    if match:
        old_img = match.group(1)
        base_name = os.path.splitext(old_img)[0]
        
        # Suche nach der passenden realen Datei (egal ob .jpg, .jpeg, .webp)
        new_img_path = None
        for real_img in real_images:
            if real_img.lower().startswith(base_name.lower()):
                new_img_path = f"archiv/{real_img}"
                break
        
        if new_img_path:
            content = content.replace(f'image: "{old_img}"', f'image: "{new_img_path}"')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename} -> {new_img_path}")
        else:
            print(f"No image found for {filename} (base: {base_name})")
