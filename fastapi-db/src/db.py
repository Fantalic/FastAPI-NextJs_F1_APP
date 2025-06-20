import sqlite3
import signal
import sys


# Verbindung zur SQLite-Datenbank herstellen (Datei existiert oder wird neu erstellt)
_db = sqlite3.connect('../data/formel1.db')

def query(q:str):
    result = None
    try:
        print("QUERY ...")
        print(q)
        # Cursor-Objekt erzeugen, um SQL-Befehle auszuführen
        cursor = _db.cursor()
        # SQL-Abfrage, um alle Tabellen der Datenbank aufzulisten
        cursor.execute(q)
        # Ergebnis abrufen
        rows = cursor.fetchall()
        if cursor.description is None:
            return rows

        columns = [description[0] for description in cursor.description]
        result = [dict(zip(columns, row)) for row in rows]
        cursor.close()

    except Exception as e:
        print(e)
        return e

    return result

def get_all_tables():
    result = []
    list = query("SELECT name FROM sqlite_master WHERE type='table';")


    if isinstance(list, Exception):
        return result

    for t in list:
        print(t)
        result.append(t["name"])

    return result

def get_foreign_key_table_names(table:str):
    fk_dict = {}
    # PRAGMA foreign_key_list liefert alle Foreign Keys der Tabelle
    fks = query(f"PRAGMA foreign_key_list('{table}');")
    if isinstance(fks, Exception):
        return fks

    for fk in fks:
        print(fk)
        fk_dict[fk['from']] = fk['table']

    return fk_dict


def insert(table, data, id = -1):

    def quote_value(v):
        try:
            float(v)  # if convertible to float, don't quote
            return v
        except ValueError:
            return f"'{v}'"

    print("INSERT/ UPDATE ENTRY ...")

    idcol = "rowid"
    q = f"SELECT {idcol} FROM {table} WHERE {idcol} = '{id}';"
    result = query(q)

    if not result:
        q = f"SELECT COUNT(*) FROM {table};"
        result = query(q)
        id = str(result[0]["COUNT(*)"] + 1)
        q = f"INSERT INTO {table}"
        q += f"({', '.join(data.keys())}) VALUES ({', '.join(quote_value(v) for v in data.values())});"
    else:
        q = f"UPDATE {table} SET {', '.join([f'{k} = {quote_value(v)}' for k, v in data.items()])} WHERE {idcol} = {id};"

    result = query(q)

    print(result)
    print(id)

    if isinstance(result, Exception):
        return result

    _db.commit()
    return id

def signal_handler(sig, frame):
    print('Beende Server, schließe DB-Verbindung...')
    _db.close()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)




