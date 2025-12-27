
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FileText } from 'lucide-react';

interface SuggestionListProps {
    items: any[];
    command: (item: any) => void;
}

const SuggestionList = forwardRef((props: SuggestionListProps, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    if (props.items.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 text-xs text-zinc-500 dark:text-zinc-500 shadow-xl">
                Nenhuma nota encontrada.
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden min-w-[200px] max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col p-1">
            {props.items.map((item, index) => (
                <button
                    className={`flex items-center gap-2 text-left text-sm p-2 rounded transition-colors ${index === selectedIndex
                        ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                    key={index}
                    onClick={() => selectItem(index)}
                >
                    <FileText size={14} className={index === selectedIndex ? "text-blue-600 dark:text-blue-500" : "text-zinc-400 dark:text-zinc-500"} />
                    <span className="truncate">{item.label}</span>
                </button>
            ))}
        </div>
    );
});

export default SuggestionList;
