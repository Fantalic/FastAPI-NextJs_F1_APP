def getTablePrimaryKey(table):
    # return db.query(f"PRAGMA table_info('{table}');")[0]["pk"]
    if table == "drivers":
        return "driverid"
    elif table == "circuits":
        return "criuitid"
    elif table == "results":
        return "resultid"
    elif table == "qualifying":
        return "qualfyid"
    elif table == "seasons":
        return "seasonid"
    elif table == "constructors":
        return "constructorid"
    elif table == "races":
        return "raceid"