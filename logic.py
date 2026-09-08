import os
import zipfile


def zip_codebase(input_dir, output_dir):
    input_dir = os.path.abspath(input_dir)
    output_dir = os.path.abspath(output_dir)

    if not os.path.isdir(input_dir):
        raise ValueError(f"Input directory does not exist: {input_dir}")

    os.makedirs(output_dir, exist_ok=True)

    # Name the ZIP after the codebase directory
    codebase_name = os.path.basename(os.path.normpath(input_dir))
    zip_path = os.path.join(output_dir, f"{codebase_name}.zip")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(input_dir):

            # Skip unnecessary directories
            dirs[:] = [
                d for d in dirs
                if d not in {
                    ".git",
                    "node_modules",
                    "__pycache__",
                    ".venv",
                    "venv",
                    "dist",
                    "build"
                }
            ]

            for file in files:
                file_path = os.path.join(root, file)

                # Path inside ZIP relative to the codebase directory
                arcname = os.path.relpath(file_path, input_dir)

                zipf.write(file_path, arcname)

    print("Codebase zipped successfully!")
    print(f"ZIP file: {zip_path}")


if __name__ == "__main__":

    # ==========================================
    # HARD-CODE YOUR DIRECTORIES HERE
    # ==========================================

    input_dir = r"E:\Projects\Vyperx\travelista-route"
    output_dir = r"C:\Users\radar\Downloads"

    # ==========================================

    zip_codebase(input_dir, output_dir)