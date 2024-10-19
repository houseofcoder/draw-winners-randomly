import yt_dlp
import json
import time
def check_youtube_link_yt_dlp(url):
    ydl_opts = {
        'noplaylist': True,  # Ensure we're checking only single videos
        'quiet': True
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            result = ydl.extract_info(url, download=False)
            # return f"{url} - Link is working (Title: {result['title']})", True
            return "", True
        except yt_dlp.utils.DownloadError as e:
            return f"{url} - ERROR: {str(e)}", False

# Load the JSON file
with open('output2.json', 'r') as file:
    youtube_data = json.load(file)

valid_entries = []  # To store only valid entries

# Iterate through each entry in the JSON file
for entry in youtube_data:
    link = entry.get("Link")
    status_message, is_valid = check_youtube_link_yt_dlp(link)
    print(status_message)
    
    # Only keep valid entries
    if is_valid:
        valid_entries.append(entry)

# Generate the timestamped filename
timestamp = time.strftime("%Y%m%d_%H%M%S")
output_filename = f"output_{timestamp}.json"

# Write the valid entries to a new JSON file
with open(output_filename, 'w', encoding='utf-8') as file:
    json.dump(valid_entries, file, ensure_ascii=False, indent=4)

print(f"Cleaned file saved as {output_filename}. Total valid links: {len(valid_entries)}")
