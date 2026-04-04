import os
import re

md_dir = 'frontend/src/content/events/archiv'
img_archiv_dir = 'frontend/public/images/events/archiv'

# Hole alle real existierenden Bilder im Archiv-Ordner
real_images = [f for f in os.listdir(img_archiv_dir) if f.startswith('archiv_') and f.endswith('.webp')]

for filename in os.listdir(md_dir):
    if not filename.endswith('.md'): continue
    
    file_path = os.path.join(md_dir, filename)
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extrahiere den aktuellen Bild-Eintrag (falls vorhanden)
    match = re.search(r'image: "([^"]+)"', content)
    if match:
        old_img_full = match.group(1)
        # Extrahiere den reinen Dateinamen ohne Pfad
        old_img_name = os.path.basename(old_img_full)
        # Extrahiere den Basename (z.B. franco-2-live-high)
        # Wir entfernen Endungen und falls vorhanden "archiv_" (um Duplikate zu vermeiden)
        base_name = re.sub(r'^(archiv_)', '', os.path.splitext(old_img_name)[0])
        
        # Suche nach der passenden neuen WebP Datei
        new_img_filename = None
        for real_img in real_images:
            # Check ob die neue Datei den Basename enthält
            if base_name.lower() in real_img.lower():
                new_img_filename = real_img
                break
        
        if new_img_filename:
            new_path = f"archiv/{new_img_filename}"
            content = content.replace(f'image: "{old_img_full}"', f'image: "{new_path}"')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename} -> {new_path}")
        else:
            print(f"Still no match for {filename} (base: {base_name})")
    else:
        # Fallback: Falls gar kein Image-Tag da ist, versuchen wir es über den Titel
        title_match = re.search(r'title: "([^"]+)"', content)
        if title_match:
            title = title_match.group(1)
            # Sehr einfacher Abgleich
            for real_img in real_images:
                # Normalisiere Titel und Bildname
                simple_title = re.sub(r'[^a-z0-9]', '', title.lower())
                simple_img = re.sub(r'[^a-z0-9]', '', real_img.lower())
                if simple_title in simple_img or simple_img in simple_title:
                    new_path = f"archiv/{real_img}"
                    # Füge image Tag hinzu falls nicht vorhanden
                    content = content.replace('title:', f'image: "{new_path}"\ntitle:')
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Added via Title: {filename} -> {new_path}")
                    break
