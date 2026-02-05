from app import app, regenerate_json_files

if __name__ == "__main__":
    with app.app_context():
        regenerate_json_files()
        print("Regeneration complete.")
