'use client';
import { parseNumberOrString } from '@/_utils';
import { useEffect, useState } from 'react';
import { DropDown } from './DropDown';
import { ID_COL } from '@/_globals';
import { SelectedStates } from '@/_types';
import HighlightedText from './HighlightedText';

interface IProps {
    rows: Record<string, string | number>[]
    selectedRowId: number
    selectedState?: SelectedStates
    searchText?: string
    onSelectRow: (rowIdx: number, data: Record<string, string | number>) => void
}

export default function Table(props: IProps) {

    const [columns, setColumns] = useState<string[]>([]);
    const [shownCols, setShownCols] = useState<string[]>([]);
    const [sortCol, setSortCol] = useState<string>("");
    const [sortDir, setSortDir] = useState<string>("asc");
    const [sortedRows, setSortedRows] = useState<Record<string, string | number>[]>([]);

    if (props.selectedRowId) {
        setTimeout(() => {
            const el = document.querySelector(`#row-${props.selectedRowId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 0);
    }

    useEffect(() => {
        console.log("render Table ...")
        const cols = Object.keys(props.rows[0]);
        // remove the id col
        cols.shift()

        setShownCols(cols);
        setColumns(cols);
    }, [])

    useEffect(() => {
        const sortedRows = [...props.rows].sort((a, b) => {
            const valA = parseNumberOrString(String(a[sortCol]));
            const valB = parseNumberOrString(String(b[sortCol]));

            if (valA === undefined || valB === undefined) {
                return 0
            }

            // Sortierrichtung: 1 für aufsteigend, -1 für absteigend
            const direction = sortDir === "asc" ? 1 : -1;

            // Prüfe, ob Werte Strings sind
            if (typeof valA === "string" && typeof valB === "string") {
                return valA.localeCompare(valB) * direction;
            }

            // Prüfe, ob Werte Zahlen sind
            if (typeof valA === "number" && typeof valB === "number") {
                return (valA - valB) * direction;
            }

            // Fallback: Werte in Strings umwandeln und vergleichen
            return valA.toString().localeCompare(valB.toString()) * direction;
        });

        if (props.searchText) {
            const filteredRows = sortedRows.filter(row => {
                return Object.values(row).some(
                    value => value.toString()
                        .toLowerCase()
                        .includes(props.searchText.toLowerCase())
                )
            })
            setSortedRows(filteredRows);
        } else {
            setSortedRows(sortedRows);
        }


    }, [sortCol, sortDir, props.searchText, props.rows])

    function onSort(col: string) {
        if (col === sortCol) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortCol(col);
            setSortDir("asc");
        }
    }

    function onCheckColumn(selectedOption: string) {
        setShownCols(prevShownCols => {
            if (prevShownCols.includes(selectedOption)) {
                // Entfernen, wenn bereits vorhanden
                return prevShownCols.filter(col => col !== selectedOption);
            } else {
                // Hinzufügen, wenn noch nicht vorhanden
                return [...prevShownCols, selectedOption];
            }
        });
    }

    return (
        <div className="w-full overflow-x-auto border border-gray-300 rounded-md relative">
            <div className='absolute top-0 left-0 pl-1 pt-1  z-1  '>
                <DropDown
                    options={columns}
                    selectedOptions={shownCols}
                    onSelect={onCheckColumn}
                    withCheckBox={true}
                />
            </div>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50 sticky top-0  ">
                    <tr>
                        {shownCols.map((col, index) => (
                            <th
                                key={"header-" + index}
                                className={[
                                    (sortCol === col) ? (sortDir === "asc" ? "bg-sky-100" : "bg-sky-200") : "",
                                    "border-gray-200 text-gray-500 uppercase",
                                    "px-6 py-3 text-left text-xs font-medium tracking-wider border-b  max-w-[300px] whitespace-nowrap"
                                ].join(" ")}
                                onClick={() => onSort(col)}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedRows.map((row, rIdx) => (
                        <tr
                            key={"row-" + row[ID_COL]}
                            id={"row-" + row[ID_COL]}
                            className={(
                                row[ID_COL] === props.selectedRowId
                                    ?
                                    (props.selectedState === SelectedStates.selected && 'bg-sky-100 hover:bg-sky-300') ||
                                    (props.selectedState === SelectedStates.editing && 'bg-red-100 hover:bg-red-300') ||
                                    (props.selectedState === SelectedStates.saved && 'bg-green-100 hover:bg-green-300') || ""
                                    :
                                    (rIdx % 2 === 0 ? 'bg-gray-50 ' : 'bg-white ') + 'hover:bg-gray-200'
                            )}
                            onClick={() => props.onSelectRow(Number(row[ID_COL]), row)}
                        >

                            {shownCols.map((col, colIdx) => (
                                <td
                                    key={"col-" + rIdx + "-" + colIdx}
                                    className="px-6 py-4 border-b border-gray-200 max-w-[300px] truncate"
                                >
                                    {!props.searchText && row[col]}
                                    {props.searchText && (
                                        <HighlightedText text={String(row[col])} highlight={props.searchText} />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

