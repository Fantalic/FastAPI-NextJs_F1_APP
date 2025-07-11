export async function fetchEntry(selectedTable: string, id: number) {
	try {
		const res = await fetch(`/api/${selectedTable}?id=${id}`); // Beispiel-API
		const data = await res.json()
		return data || null
	}
	catch (error) {
		console.error(error);
		return null
	}
}

export async function fetchTable(selectedTable: string) {
	try {
		const res = await fetch(`/api/${selectedTable}`); // Beispiel-API
		const data: Record<string, any>[] = await res.json()
		return data || null
	}
	catch (error) {
		console.error(error);
		return null
	}
}

export async function fetchTables() {
	try {
		const res = await fetch('/api'); // Beispiel-API
		const data = await res.json();

		if (data && Array.isArray(data)) {
			// filter out relation tables
			const filteredStrings = data.filter(str => !str.includes("_"));
			return filteredStrings
		}
	} catch (error) {
		console.error(error);
		return []
	}
}


export async function fetchPortraitSrc(url: string) {
	try {
		const res = await fetch("/api/extract-portrait?url=" + url)
		const data = await res.json()
		return data["image_url"]
	}
	catch (e) {
		console.error(e)
		return ""
	}

}

export async function saveEntry(table: string, entry: Record<string, any>) {
	try {
		const res = await fetch(
			`/api/${table}`,
			{ method: 'POST', body: JSON.stringify(entry), headers: { 'Content-Type': 'application/json' } }
		);
		const data = await res.json()
		return data || null
	} catch (error) {
		console.error(error);
		return null
	}
}

export async function deleteEntry(table: string, id: number) {
	try {
		const res = await fetch(
			`/api/${table}?id=${id}`,
			{ method: 'DELETE' }
		);
		const data = await res.json()
		return data || null
	} catch (error) {
		console.error(error);
		return null
	}
}
