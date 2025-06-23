package main

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

func main() {

	folder := "./csvdata" // Pfad zum Ordner mit CSV-Dateien
	if len(os.Args) > 1 {
		folder = os.Args[1] // Argument wurde übergeben
	}
	db_name := "database"
	if len(os.Args) > 2 {
		db_name = os.Args[2]
	}

	print("csv data folder: ", folder)
	print("\n")
	print("database name: ", db_name)
	print("\n")

	db, err := sql.Open("sqlite3", db_name+".db")
	if err != nil {
		log.Fatal("Datenbank öffnen:", err)
	}
	defer db.Close()

	files, err := os.ReadDir(folder)
	if err != nil {
		log.Fatal("Ordner lesen:", err)
	}

	for _, file := range files {
		if file.IsDir() {
			continue
		}
		if strings.HasSuffix(strings.ToLower(file.Name()), ".csv") {
			csvPath := filepath.Join(folder, file.Name())
			tableName := strings.TrimSuffix(file.Name(), filepath.Ext(file.Name()))
			fmt.Printf("Verarbeite Datei %s -> Tabelle %s\n", csvPath, tableName)

			err := importCSVCreateTable(db, csvPath, tableName)
			if err != nil {
				log.Fatalf("Fehler bei %s: %v\n", csvPath, err)
			}
		}
	}

	fmt.Println("Alle CSV-Dateien importiert.")
}

func importCSVCreateTable(db *sql.DB, csvFile, table string) error {
	file, err := os.Open(csvFile)
	if err != nil {
		return fmt.Errorf("CSV-Datei öffnen: %w", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)

	// Kopfzeile mit Spaltennamen lesen
	columns, err := reader.Read()
	if err != nil {
		return fmt.Errorf("Spaltennamen lesen: %w", err)
	}

	// Tabelle löschen, falls vorhanden (optional)
	_, err = db.Exec(fmt.Sprintf("DROP TABLE IF EXISTS %s", table))
	if err != nil {
		return fmt.Errorf("Tabelle löschen: %w", err)
	}

	// Tabelle erstellen mit TEXT-Spalten (vereinfachte Annahme)
	colDefs := make([]string, len(columns))
	for i, col := range columns {
		colName := sanitizeColumnName(col)
		colDefs[i] = fmt.Sprintf("%s TEXT", colName)
		columns[i] = colName // Spaltenname für Insert anpassen
	}
	createSQL := fmt.Sprintf("CREATE TABLE %s (%s)", table, strings.Join(colDefs, ", "))
	_, err = db.Exec(createSQL)
	if err != nil {
		return fmt.Errorf("Tabelle erstellen: %w", err)
	}

	// Insert vorbereiten
	placeholders := make([]string, len(columns))
	for i := range placeholders {
		placeholders[i] = "?"
	}
	insertSQL := fmt.Sprintf("INSERT INTO %s (%s) VALUES (%s)", table, strings.Join(columns, ", "), strings.Join(placeholders, ", "))

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Transaktion starten: %w", err)
	}
	stmt, err := tx.Prepare(insertSQL)
	if err != nil {
		return fmt.Errorf("Statement vorbereiten: %w", err)
	}
	defer stmt.Close()

	// Datenzeilen einlesen und einfügen
	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("CSV lesen: %w", err)
		}

		values := make([]interface{}, len(record))
		for i, v := range record {
			values[i] = v
		}

		_, err = stmt.Exec(values...)
		if err != nil {
			tx.Rollback()
			return fmt.Errorf("Daten einfügen: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Transaktion committen: %w", err)
	}

	return nil
}

// sanitizeColumnName entfernt Leerzeichen und Sonderzeichen aus Spaltennamen
func sanitizeColumnName(name string) string {
	name = strings.TrimSpace(name)
	name = strings.ToLower(name)
	name = strings.ReplaceAll(name, " ", "_")
	// weitere Ersetzungen je nach Bedarf
	return name
}
