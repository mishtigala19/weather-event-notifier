"use client";
import { useEffect } from 'react';
import { api } from '@/lib/api';

export default function Warmup() {
    useEffect(() => {
        (async () => {
            try {
                const res = await api.getServerStatus();
                // eslint-disable-next-line no-console
                console.log('[warmup] backend status', res);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.warn('[warmup] status failed', e);
            }
        })();
    }, []);

    return null;
}


