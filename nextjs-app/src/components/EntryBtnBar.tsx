
interface IProps{
    editing: boolean,
    isRowSelected: boolean,
    onSave: () => void
    onEdit: (b:boolean) => void
    onDelete: () => void
    onCreateEntry: () => void
}
export default function EntryBtnBar(props:IProps){
    return (
        <>
        { props.editing === false && (
            <button
              className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out"
              onClick={props.onCreateEntry}
            >
              + Add New Entry
            </button>
        )}

        { props.isRowSelected && (
            <>
                <button
                    className={[
                        "px-4 py-2 font-medium text-white rounded-md  focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out",
                        (props.editing ? "bg-green-600  hover:bg-green-500": "bg-blue-600 hover:bg-blue-500")
                    ].join(" ")}

                    onClick={()=>props.onEdit(!props.editing)}
                >
                    {props.editing ?"Save":"Edit"}
                </button>
                <button
                    className="ml-2 px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out"
                    onClick={props.onDelete}
                >
                    Delete
                </button>
            </>
        )}
        </>
    )
}