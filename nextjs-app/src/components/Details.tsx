import { useState, useEffect } from 'react';
import Edit from './icons/Edit';
import Save from './icons/Save';
import { isWikipediaUrl } from '@/_utils';
import { SpecialIds } from '@/_types';
import { fetchPortraitSrc } from '@/_api_calls';

interface IProps{
    data:Record<string,any>
    selectedId:number,
    editing: boolean,
    onSave: (data:Record<string,any>) => void
}

export default function Details(props:IProps) {

    const cols = props.data && Object.keys(props.data);
    cols.shift()
    const showMap = cols && cols.includes("lat") && cols.includes("lng");
    const [portraitSrc, setPortraitSrc] = useState<string | null>(null);
    const [editCol, setEditCol] = useState<string | null>(null);
    const [editAll, setEditAll] = useState(props.editing || props.selectedId === SpecialIds.new);
    const [loading, setLoading] = useState(false);
    const [entryData, setEntryData] = useState<Record<string,any>>(props.data || {});

    useEffect(() => {

        setPortraitSrc("")

        if (props.selectedId === SpecialIds.new){
            setEditAll(true)
            const entry:Record<string,any> = {}
            if (props.data){
                Object.keys(props.data).forEach((key) => {
                    entry[key] = ""
                })
            }
            setEntryData(entry)
        }

        else {
            for (var i = 0; i < cols.length; i++) {
                if (isWikipediaUrl(props.data[cols[i]])){
                    setLoading(true)
                    fetchPortraitSrc(props.data[cols[i]])
                    .then((url)=>{
                        setPortraitSrc(url)
                        setLoading(false)
                    })
                    break
                }
            }
            setEntryData(props.data)
        }

    },[props.selectedId])

    useEffect(() => {

        if (props.editing !== editAll){
            if(editAll === true && props.selectedId !== SpecialIds.new){
                save()
            }
            setEditAll(props.editing)
        }
    },[props.editing])

    function save(){
        props.onSave(entryData)
        setEditCol(null)
        setEditAll(false)
    }

    return (
        <>
        { cols && cols.length > 0 && (
            <div className="max-w-sm mx-auto bg-white shadow-xl rounded-2xl  overflow-x-hidden  border border-gray-200 ">
                <div className="bg-gradient-to-br from-gray-100 to-white p-4  ">
                    {portraitSrc && !loading && (
                        <div className="w-full  overflow-hidden rounded-xl border-4 border-white shadow-inner">
                            <img src={portraitSrc}></img>
                        </div>
                    )}
                    { !loading && !editAll && showMap && entryData && (
                        <iframe
                            width="400"
                            height="400"
                            loading="lazy"
                            src={`https://www.google.com/maps?q=${entryData["lat"]},${entryData["lng"]}&hl=de&z=14&output=embed`}>
                        </iframe>
                    )}
                    {loading && (
                        <div className="loader h-[150px]"> loading ...</div>
                    )}

                    <div className='  overflow-y-auto overflow-x-hidden'>
                    {cols.map((col:string, index:number) => (
                        <div key={"value-"+index} className="flex flex-col group relative">
                            <div  className="mt-4 text-center">
                                { (editAll || editCol === col) && (
                                    <div className="flex flex-row ">
                                        <span className=" text-nowrap ml-0 mt-2">
                                            {col}:
                                        </span>
                                        <span>
                                            <input
                                                className="w-full text-gray-800 border border-gray-300 rounded-md p-2 ml-2"
                                                type="text"
                                                value={entryData[col] || ""}
                                                onChange={(e) => setEntryData(prev => ({
                                                    ...prev,
                                                    [col]: e.target.value,
                                                  }))
                                                }
                                            />
                                        </span>
                                    </div>
                                )}
                                { !editAll && editCol !== col && (
                                    <>
                                    <p className="text-sm text-gray-500">{col}</p>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        { !isWikipediaUrl(props.data[col])
                                            ? entryData && entryData[col] || ""
                                            : <a className='hover:text-blue-600 text-blue-400' href={props.data[col]} target="_blank" rel="noopener noreferrer">{props.data[col]}</a>
                                        }
                                    </h2>

                                    </>
                                )}
                            </div>

                            { !editAll && (
                                <div
                                    className="absolute invisible group-hover:visible hover:cursor-pointer right-0  p-auto "
                                    onClick={()=>col === editCol ? save() : setEditCol(col)}
                                >
                                    <div >
                                    { editCol === col ? (
                                        <Save/>
                                    ):(
                                        <Edit/>
                                    )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    </div>
                </div>
                {(editAll || editCol) && (
                    <div className="flex items-center justify-center">
                        <button
                            className={[
                                "px-4 py-2 font-medium text-white rounded-md  focus:outline-none focus:shadow-outline-blue transition duration-150 ease-in-out",
                                "bg-green-600  hover:bg-green-500"
                            ].join(" ")}
                            onClick={()=> save()}
                        >
                            Save
                        </button>
                    </div>
                )}

            </div>
        )}
        </>
    )
}
