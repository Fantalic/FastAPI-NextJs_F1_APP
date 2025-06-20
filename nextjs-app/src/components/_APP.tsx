'use client';
import Table from "@/components/Table";
import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import Details from "@/components/Details";
import { SearchBar } from "@/components/SearchBar";
import { DropDown } from "@/components/DropDown";
import EntryBtnBar from "@/components/EntryBtnBar";
import NewEntryModal from "@/components/NewEntryModal";
import { deleteEntry, fetchTable, fetchTables, saveEntry } from "../_api_calls";
import { SelectedStates, SpecialIds } from "../_types";
import { ID_COL } from "@/_globals";

interface IProps {
  table:string,
  id:string,
}

const _App: React.FC<IProps> = ({ table, id }) => {

  const [tables, setTables] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Record<string,any>[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const router = useRouter();
  const selectedId = Number(id)
  const selectedTable = table

  useEffect(() => {
    fetchTables().then((data:string[]|undefined) => {
      setTables(data || []);
    })
  },[])

  useEffect(() => {
    fetchTable(selectedTable).then((data) => {
      setTableData(Array.isArray(data) ? data : [])
    });
  }, [selectedTable]);

  function onSelectTable(table:string){
    router.push(`/${table}` )
  }

  function onRowClick(rowId:number) {
    router.push(`/${selectedTable}?selected=${rowId}`, { scroll: false });
  }

  function createNewEntry() {
    router.push(`/${selectedTable}?selected=${SpecialIds.new}`, { scroll: false });
    setEditing(true);
  }

  async function save(table:string, data:Record<string,any>) {
    const id = await saveEntry(table, data)
    const d = await fetchTable(table);

    setTableData(d);
    setEditing(false);

    router.push(`/${selectedTable}?selected=${id}`, { scroll: false });
  }

  async function deleteRow(table:string, id:number) {
    const res = await deleteEntry(table, id)
    const d = await fetchTable(table);

    setTableData(d);

    router.push(`/${selectedTable}?selected=${SpecialIds.none}`, { scroll: false });
  }



  return (
    <div className="flex flex-col  w-screen h-screen bg-gray-800 overflow-y-auto p-4 items-center justify-center">
      <div className="w-full max-w-6xl h-full ">
        <div className="flex flex-col md:flex-row md:gap-8 gap-6 mt-6">
          <DropDown
            options={tables}
            selectedOptions={[selectedTable]}
            onSelect={onSelectTable}
          />

          <SearchBar onSearch={(text) => setSearchText(text)}/>
          <EntryBtnBar
            isRowSelected={selectedId >= 0}
            editing={editing}
            onEdit={setEditing}
            onSave={() => setEditing(false)}
            onDelete={() => deleteRow(selectedTable, selectedId)}
            onCreateEntry={createNewEntry}
          />
        </div>
        <div className="flex flex-col md:flex-row md:gap-8 gap-6 mt-6 max-w-full max-h-[80vh] ">
          { tableData && (
            <>
              <Table
                rows={tableData}
                onSelectRow={onRowClick}
                selectedRowId={selectedId}
                selectedState={editing ? SelectedStates.editing : SelectedStates.selected}
                searchText={searchText}
              />
              <Details
                editing={editing}
                data={tableData.find((row) => (row[ID_COL] === selectedId)) || {}}
                selectedId={selectedId}
                onSave={(data) => save(selectedTable, data)}
              />
              <NewEntryModal
                title={`New ${selectedTable} Entry`}
                isOpen={selectedId === SpecialIds.new}
                onClose={() => router.push(`/${selectedTable}?selected=${SpecialIds.none}`, { scroll: false })}
              >
                <Details
                  editing={true}
                  data={tableData[0]}
                  selectedId={SpecialIds.new}
                  onSave={(data) => save(selectedTable, data)}
                />
              </NewEntryModal>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const App = memo(_App)