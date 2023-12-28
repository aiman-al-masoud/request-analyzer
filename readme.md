# Request Analyzer

Sends an HTTP request to a specified website, and displays the results for the user to analyze.

## Run Locally (Linux)

1. clone this repository
2. navigate to the [`src/client`](./src/client/) directory
3. install the node dependencies
```bash
npm install
```
4. build the client bundle (Single Page Application)
```bash
./build
```
5. navigate to the [`src/server`](./src/server/) directory
6. create a python virtual environment

```bash
python -m venv .env
```
7. activate the environment

```bash
source .env/bin/activate
```

8. install the python dependencies

```bash
pip install -r requirements.txt
```

9. run the server locally

```bash
python -m flask run
```
