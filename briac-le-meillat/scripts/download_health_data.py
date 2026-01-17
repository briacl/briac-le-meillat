import os
import urllib.request
import re
import sys

# Constants
DATASET_URL = "https://www.data.gouv.fr/datasets/annuaire-sante-extractions-des-donnees-en-libre-acces-des-professionnels-intervenant-dans-le-systeme-de-sante"
TARGET_FILES = [
    "ps-libreacces-personne-activite.txt",
    "ps-libreacces-dipl-autexerc.txt",
    "ps-libreacces-savoirfaire.txt"
]
# Determine the absolute path for storage/app/data
# Assuming this script is in synapseo/scripts/ and we want synapseo/storage/app/data/
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "storage", "app", "data")

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        print(f"Creating directory: {directory}")
        os.makedirs(directory)

def get_page_content(url):
    print(f"Fetching page content from: {url}")
    try:
        with urllib.request.urlopen(url) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Error fetching page: {e}")
        sys.exit(1)

def find_file_urls(html_content, target_filenames):
    found_urls = {}
    for filename in target_filenames:
        # Regex to find hrefs that likely point to the file
        # data.gouv.fr links might be like https://static.data.gouv.fr/.../filename
        # We look for the filename at the end of the url or mainly in the url string
        pattern = r'href="([^"]*' + re.escape(filename) + r'[^"]*)"'
        matches = re.findall(pattern, html_content)
        
        # Also try looking for the filename inside the url without exact match if needed, 
        # but exact filename match in URL is safer if they match exactly what user asked.
        # The user provided specific names, usually these are the end of the URL.
        
        if matches:
            # Take the first match that looks like a full URL or relative
            # data.gouv.fr usually has full static URLs
            found_urls[filename] = matches[0]
            print(f"Found URL for {filename}: {matches[0]}")
        else:
            print(f"Warning: Could not find link for {filename}")
            
    return found_urls

def download_file(url, output_path):
    print(f"Downloading {url} to {output_path}...")
    try:
        urllib.request.urlretrieve(url, output_path)
        print("Download complete.")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

def main():
    ensure_directory_exists(OUTPUT_DIR)
    
    html_content = get_page_content(DATASET_URL)
    
    file_urls = find_file_urls(html_content, TARGET_FILES)
    
    if not file_urls:
        print("No files found to download.")
        return

    for filename, url in file_urls.items():
        output_path = os.path.join(OUTPUT_DIR, filename)
        download_file(url, output_path)

    print("\nAll operations completed.")

if __name__ == "__main__":
    main()
