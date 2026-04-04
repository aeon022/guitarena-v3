import os
import xml.etree.ElementTree as ET
import re
from datetime import datetime

xml_path = 'drafts & content/beiträge-guitarena.WordPress.2026-04-04.xml'
output_dir = 'frontend/src/content/events/archiv'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Parse XML
tree = ET.parse(xml_path)
root = tree.getroot()
channel = root.find('channel')

# Namespaces
ns = {
    'content': 'http://purl.org/rss/1.0/modules/content/',
    'wp': 'http://wordpress.org/export/1.2/',
    'dc': 'http://purl.org/dc/elements/1.1/'
}

# 1. Map attachments
attachments = {}
for item in channel.findall('item'):
    post_type = item.find('wp:post_type', ns).text
    if post_type == 'attachment':
        post_id = item.find('wp:post_id', ns).text
        url = item.find('wp:attachment_url', ns).text
        filename = os.path.basename(url)
        # Change to .webp since the user said they are all .webp now
        filename = os.path.splitext(filename)[0] + '.webp'
        attachments[post_id] = filename

# 2. Process posts
for item in channel.findall('item'):
    post_type = item.find('wp:post_type', ns).text
    if post_type != 'post':
        continue
    
    status = item.find('wp:status', ns).text
    if status != 'publish':
        continue

    title = item.find('title').text
    slug = item.find('wp:post_name', ns).text
    content = item.find('content:encoded', ns).text or ""
    
    # Get metadata
    meta = {}
    for pm in item.findall('wp:postmeta', ns):
        key = pm.find('wp:meta_key', ns).text
        value = pm.find('wp:meta_value', ns).text
        meta[key] = value

    # Extract date
    event_date_str = meta.get('datum')
    if event_date_str:
        try:
            # Format: 2022-03-04 19:30:00
            event_date = datetime.strptime(event_date_str, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            event_date = datetime.strptime(item.find('wp:post_date', ns).text, '%Y-%m-%d %H:%M:%S')
    else:
        event_date = datetime.strptime(item.find('wp:post_date', ns).text, '%Y-%m-%d %H:%M:%S')

    # Extract image
    thumb_id = meta.get('_thumbnail_id')
    image = attachments.get(thumb_id)

    # Extract video
    video = None
    # Look for youtube links in meta (oembed)
    for key, val in meta.items():
        if '_oembed' in key and 'youtube.com/embed/' in str(val):
            match = re.search(r'src="([^"]+)"', val)
            if match:
                video = match.group(1).split('?')[0] # Clean URL
                break
    
    # Fallback: search in content
    if not video:
        yt_match = re.search(r'youtube\.com/watch\?v=([a-zA-Z0-9_-]+)', content)
        if yt_match:
            video = f"https://www.youtube.com/watch?v={yt_match.group(1)}"

    # Clean content
    # Remove Gutenberg comments
    content = re.sub(r'<!-- /?wp:[^>]+ -->', '', content)
    # Remove some common HTML tags but keep some structure
    content = content.replace('<p>', '').replace('</p>', '\n\n')
    content = content.replace('<strong>', '**').replace('</strong>', '**')
    content = content.replace('<em>', '*').replace('</em>', '*')
    content = re.sub(r'<figure[^>]*>.*?</figure>', '', content, flags=re.DOTALL) # Remove embeds as we handle them in frontmatter
    content = content.strip()

    # Create filename
    filename = f"{event_date.strftime('%Y-%m-%d')}-{slug}.md"
    file_path = os.path.join(output_dir, filename)

    # Prepare Frontmatter
    frontmatter = [
        "---",
        f'title: "{title}"',
        f'date: {event_date.isoformat()}',
        'location: "Ortenburgerkeller, Schloss Porcia, Spittal/Drau"',
    ]
    if image:
        frontmatter.append(f'image: "{image}"')
    if video:
        frontmatter.append(f'video: "{video}"')
    frontmatter.append('ticketLink: "mailto:karten@porcia.at"')
    frontmatter.append("---")

    md_content = "\n".join(frontmatter) + "\n\n" + content

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(md_content)

print(f"Archiv importiert in {output_dir}")
