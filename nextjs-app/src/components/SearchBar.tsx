import { useState } from "react";

interface IProps {
    onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: IProps) {

    const [searchQuery, setSearchQuery] = useState('');
    function setQuery(value: string) {
        setSearchQuery(value);
        setTimeout(() => onSearch(value), 1000);
    }

    return (
        <div className="mr-auto w-[200px]">
            <div className="relative text-gray-600 focus-within:text-gray-400">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button 
                    type="submit" 
                    className="p-1 focus:outline-none focus:shadow-outline"
                    onClick={() => onSearch(searchQuery)}
                >
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                </button>
            </span>
            <input 
                className="py-2 text-sm text-white bg-gray-900 rounded-md pl-10 focus:outline-none focus:bg-white focus:text-gray-900" 
                type="search" 
                name="q" 
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setQuery(e.target.value)}  
            />
            </div>
        </div>
    )
}
