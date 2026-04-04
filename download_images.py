import os
import xml.etree.ElementTree as ET
import urllib.request

xml_path = 'drafts & content/beiträge-guitarena.WordPress.2026-04-04.xml'
output_dir = 'frontend/public/images/events'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Parse XML
tree = ET.parse(xml_path)
root = tree.getroot()
channel = root.find('channel')

# Namespaces
ns = {
    'wp': 'http://wordpress.org/export/1.2/'
}

urls = set()
for item in channel.findall('item'):
    post_type = item.find('wp:post_type', ns).text
    if post_type == 'attachment':
        url = item.find('wp:attachment_url', ns).text
        if url:
            urls.add(url)

print(f"Found {len(urls)} images to download.")

for url in urls:
    filename = os.path.basename(url)
    # Save as original format first
    target_path = os.path.join(output_dir, filename)
    
    if os.path.exists(target_path):
        print(f"Skipping {filename}, already exists.")
        continue
        
    try:
        print(f"Downloading {filename}...")
        urllib.request.urlretrieve(url, target_path)
    except Exception as e:
        print(f"Error downloading {url}: {e}")

print("Download abgeschlossen.")
