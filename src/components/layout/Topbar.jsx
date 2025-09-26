"use client";
export default function Topbar({ title, right }) {
    return (
        <header className="h-14 border-b border-neutral-200 flex items-center justify-between px-4">
            <h1 className="text-base font-semibold">{title}</h1>
            <div className="flex items-center gap-2">{right}</div>
        </header>
    );
}
