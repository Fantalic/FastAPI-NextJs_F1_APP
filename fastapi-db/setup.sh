
#!/bin/bash
# Linux/macOS: virtuelles Environment erstellen und requirements installieren

if ! command -v python3 &> /dev/null; then
  echo "Python3 ist nicht installiert oder nicht im PATH."
  exit 1
fi

if [ ! -d ".venv" ]; then
  echo "Erstelle virtuelles Environment .venv ..."
  python3 -m venv .venv
else
  echo "Virtuelles Environment .venv existiert bereits."
fi

source .venv/bin/activate

if [ -f "requirements.txt" ]; then
  echo "Installiere Abhängigkeiten aus requirements.txt ..."
  pip install --upgrade pip
  pip install -r requirements.txt
else
  echo "Keine requirements.txt gefunden. Überspringe Installation."
fi

echo "Setup abgeschlossen."
