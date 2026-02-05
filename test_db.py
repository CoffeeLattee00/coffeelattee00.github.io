from app import app, db, Post

try:
    with app.app_context():
        print("Querying posts...")
        posts = Post.query.all()
        print(f"Found {len(posts)} posts.")
except Exception as e:
    print(f"Error: {e}")
