"""Deploy backend to Hugging Face Spaces"""
import os
from huggingface_hub import HfApi, create_repo

api = HfApi()

# Get username
user_info = api.whoami()
username = user_info["name"]
print(f"Logged in as: {username}")

# Create the Space
repo_id = f"{username}/ev-vehicle-classifier"
try:
    create_repo(
        repo_id=repo_id,
        repo_type="space",
        space_sdk="docker",
        exist_ok=True,
        private=False,
    )
    print(f"Space created: {repo_id}")
except Exception as e:
    print(f"Space may already exist: {e}")

# Upload all backend files
backend_dir = os.path.join(os.path.dirname(__file__), "backend")

files_to_upload = []
for root, dirs, files in os.walk(backend_dir):
    # Skip __pycache__
    dirs[:] = [d for d in dirs if d != "__pycache__"]
    for file in files:
        local_path = os.path.join(root, file)
        # Path relative to backend dir
        rel_path = os.path.relpath(local_path, backend_dir)
        files_to_upload.append((local_path, rel_path))

print(f"\nUploading {len(files_to_upload)} files...")
for local_path, rel_path in files_to_upload:
    print(f"  Uploading: {rel_path}")
    api.upload_file(
        path_or_fileobj=local_path,
        path_in_repo=rel_path,
        repo_id=repo_id,
        repo_type="space",
    )

print(f"\n✅ All files uploaded!")
print(f"🌐 Space URL: https://huggingface.co/spaces/{repo_id}")
print(f"🔗 API URL: https://{username}-ev-vehicle-classifier.hf.space")
