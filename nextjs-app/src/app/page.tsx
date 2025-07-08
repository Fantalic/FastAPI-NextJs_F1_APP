'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/drivers');
    }, []);

    return (
        <div>
            <h1>Home</h1>
        </div>
    );
}