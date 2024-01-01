# Request Analyzer

Sends an HTTP request to a specified website, and displays the results for the user to analyze.

## Run Locally (Linux)

```bash
git clone ${link-to-this-repo} .
cd ./request-analyzer/src/server
python -m venv .env
source .env/bin/activate
pip install -r requirements.txt
cd ../client
npm install
./build
cd ../server
python -m flask run # ... and open link in browser
```