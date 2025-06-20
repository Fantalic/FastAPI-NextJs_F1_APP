'use client';

import { useEffect, useState, memo } from "react";
import { CheckBox } from "./CheckBox";

interface IProps {
    options:string[],
    selectedOptions:string[],
    onSelect: (option: string) => void,
    withCheckBox?:boolean,
    placeholder?:string
}
const _DropDown: React.FC<IProps> = (props:IProps) => {
    // <!-- Active: "bg-gray-100 text-gray-900 outline-hidden", Not Active: "text-gray-700" -->
    const [isOpen, setIsOpen] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(0);

    useEffect(()=>{
        setTriggerUpdate(triggerUpdate + 1);
    },[props.selectedOptions])

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded="true"
                    aria-haspopup="true"
                    onClick={()=>setIsOpen(!isOpen)}
                >
                { props.withCheckBox ? props.placeholder : props.selectedOptions.length > 0 ? props.selectedOptions[0] : props.placeholder}
                <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                    <path
                        fillRule="evenodd"
                        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
                </button>
            </div>

            {isOpen &&  (
                <div
                    className="absolute left-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden "
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                >
                    {props.options && props.options.map && props.options.map((option, index) => (
                        <div
                            key={"option-"+index}
                            className="flex flex-row cursor-pointer hover:bg-blue-400 px-4 py-2 text-sm text-gray-700" role="menuitem" id="menu-item-0"
                            onClick={(e) =>{ e.preventDefault(); props.onSelect(option)}}
                        >
                            {props.withCheckBox && <CheckBox checked={props.selectedOptions.includes(option)} />}
                            <div className="ml-2">{option}</div>
                        </div>

                   ))}

                </div>
            )}

        </div>
    )
}

export const DropDown = memo(_DropDown);