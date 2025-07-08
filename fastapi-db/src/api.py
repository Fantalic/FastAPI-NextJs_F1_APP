from fastapi import FastAPI, HTTPException, Request, WebSocket, Query
from fastapi.responses import JSONResponse
from typing import List
import httpx
from bs4 import BeautifulSoup
import db

app = FastAPI()
clients = []

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Optional: Echo oder Logik
    except:
        clients.remove(websocket)

async def notify_clients(message: str):
    for client in clients:
        await client.send_text(message)

# Beispiel: Funktion, die bei DB-Änderung aufgerufen wird
async def on_db_change():
    await notify_clients("update_db")


@app.get("/extract-portrait")
async def extract_portrait(url: str = Query(..., description="URL of the Wikipedia page")):
    try:
        # Fetch HTML from the target URL
        async with httpx.AsyncClient() as client:
            _url = url.replace("http://", "https://", 1)
            response = await client.get(_url)
            response.raise_for_status()

        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find the image in the infobox
        img_tag = soup.select_one('.infobox .infobox-image img')

        if img_tag and img_tag.get("src"):
            src = img_tag["src"]
            full_url = "https:" + src if src.startswith("//") else src
            return {"image_url": full_url}

        return JSONResponse(status_code=404, content={"error": "No infobox image found."})

    except Exception as e:
        print(str(e))
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/", response_model=List[str])
async def get_tables():
    tables = db.get_all_tables()
    return JSONResponse(content=tables)

@app.get("/{table}")
async def get_table(table: str, request:Request):

    params = dict(request.query_params)

    id = params.get("id")
    query = f"SELECT rowid, * FROM {table}"

    if id:
        query += f" WHERE rowid = {id}"

    # WHERE-Klausel nur hinzufügen, wenn Parameter vorhanden sind
    if params:
        where_clauses = []
        for key, value in params.items():
            where_clauses.append(f"{key} = {value}")
        where_statement = " AND ".join(where_clauses)
        query += f" WHERE {where_statement}"

    result = db.query(query)

    if isinstance(result, Exception):
        raise HTTPException(status_code=404, detail=str(result))

    return JSONResponse(content=result)

@app.get("/{table}/foreign_keys")
async def get_foreign_keys(table: str ):
    print("FOREIGN KEYS")
    foreign_keys = db.get_foreign_key_table_names(table)
    print(foreign_keys)
    return JSONResponse(content=foreign_keys)


@app.post("/{table}")
async def create_entry (table:str, body:dict):
    id = -1
    if "rowid" in body:
        id = body["rowid"]
        del body["rowid"]

    result = db.insert(table, body, id)
    return result

@app.delete("/{table}")
async def delete_entry(table: str, request:Request):
    params = dict(request.query_params)
    print(params)

    id = params.get("id")
    if id is None:
        return

    q = f"DELETE  FROM {table} WHERE rowid = {id}"
    result = db.query(q)

    return result
