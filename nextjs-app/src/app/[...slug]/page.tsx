'use client';

import { useSearchParams } from 'next/navigation';
import { usePathname } from 'next/navigation'
import { SpecialIds } from "../../_types";
import { App } from '@/components/_APP';

export default function Home() {
	console.log("page render ...")

	const pathArray = usePathname().slice(1).split("/")
	// pathArray[0] is allways set because on index page is redirect
	const selectedTable = pathArray[0];
	const searchParams = useSearchParams();
	const selectedId = searchParams.get('selected') || String(SpecialIds.none)

	return (
		<App
			table={selectedTable}
			id={selectedId}
		></App>
	);
}
