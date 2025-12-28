import React, { useState } from 'react';
import { ReactReader } from 'react-reader';
import { Loader2 } from 'lucide-react';

import { ReaderSettings } from '../../services/libraryService';

interface EpubReaderProps {
    url: string;
    location?: string | number;
    locationChanged: (epubcifi: string | number) => void;
    settings: ReaderSettings;
}

const EpubReader: React.FC<EpubReaderProps> = ({ url, location, locationChanged, settings }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [rendition, setRendition] = useState<any>(null);

    // Apply settings when they change or rendition is available
    React.useEffect(() => {
        if (!rendition) return;

        const { theme, fontSize } = settings;

        // Themes
        const themeStyles = {
            light: {
                body: { color: '#000000', background: '#ffffff', 'font-size': `${fontSize}%` }
            },
            dark: {
                body: { color: '#e4e4e7', background: '#09090b', 'font-size': `${fontSize}%` }
            },
            sepia: {
                body: { color: '#5b4636', background: '#f4ecd8', 'font-size': `${fontSize}%` }
            }
        };

        rendition.themes.register(theme, themeStyles[theme]);
        rendition.themes.select(theme);

    }, [settings, rendition]);

    return (
        <div className={`h-full relative font-serif ${settings.theme === 'light' ? 'bg-white' : settings.theme === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-transparent'}`}>
            {isLoading && (
                <div className={`absolute inset-0 flex items-center justify-center z-10 ${settings.theme === 'light' ? 'bg-white' : settings.theme === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-black/80 backdrop-blur-xl'}`}>
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                        <span className="text-xs text-zinc-500 font-medium animate-pulse">Carregando livro...</span>
                    </div>
                </div>
            )}

            <div style={{ height: '100%' }}>
                <ReactReader
                    url={url}
                    location={location}
                    locationChanged={(loc) => {
                        locationChanged(loc);
                        setIsLoading(false);
                    }}
                    epubInitOptions={{
                        openAs: 'epub',
                    }}
                    getRendition={(r) => {
                        setRendition(r);
                        setIsLoading(false);
                    }}
                />
            </div>
            <style>{`
        /* Overrides for react-reader specific UI if needed */
        .react-reader__toc {
            color: #18181b !important;
        }
      `}</style>
        </div>
    );
};

export default EpubReader;
