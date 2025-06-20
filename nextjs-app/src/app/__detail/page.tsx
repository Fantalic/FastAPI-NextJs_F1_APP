import Details from "@/components/Details";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { fetchEntry, fetchTable } from "../../_api_calls";


export default function DetailPage() {
    const searchParams = useSearchParams();
    const table = searchParams.get('table');
    const selectedRowId = Number((searchParams.get('selected') || -1));

    const [rowData, setRowData] = useState<Record<string,any> | null>(null);
    useEffect(() => {
        console.log("selectedRowId", selectedRowId)
        fetchEntry(table || "", selectedRowId).then((data) => {
            setRowData(data)
        })
    },[])

    return (
        <Details data={rowData || {}} selectedId={selectedRowId} />
    );
}