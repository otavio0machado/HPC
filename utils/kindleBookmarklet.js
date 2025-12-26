export const KINDLE_BOOKMARKLET_CODE = `
javascript:(function(){
    try {
        const books = [];
        const bookElements = document.querySelectorAll('.kp-notebook-library-each-book');
        
        if (bookElements.length === 0) {
            alert('Não foram encontrados livros nesta página. Certifique-se de estar em https://read.amazon.com/notebook');
            return;
        }

        bookElements.forEach(bookEl => {
            const titleEl = bookEl.querySelector('.kp-notebook-searchable-list-title');
            const authorEl = bookEl.querySelector('.kp-notebook-searchable-list-author');
            const highlightStatsEl = bookEl.querySelector('.kp-notebook-highlight-count');
            
            if (!titleEl) return;

            const title = titleEl.textContent.trim();
            const author = authorEl ? authorEl.textContent.trim().replace(/^By /, '') : 'Unknown API';
            const highlights = [];
            
            // Note: Amazon only loads highlights when you click the book. 
            // So we can only get highlights for the *currently selected* book efficiently via the DOM 
            // OR we iterate but we might miss content if not loaded.
            // BETTER STRATEGY for V1:
            // Just scrape the CURRENTLY OPEN book on the right side if available, 
            // OR tell user "Select a book to sync only that book".
            
            // Let's try to scrape the visible highlights container: #kp-notebook-annotations
            const annotationContainer = document.getElementById('kp-notebook-annotations');
            if (annotationContainer && annotationContainer.offsetParent !== null) {
                // We are looking at a specific book
                const currentBookTitle = document.querySelector('.kp-notebook-annotation-book-title')?.textContent.trim();
                
                // If we are iterating, we match title. If not, we skip.
                if (currentBookTitle === title) {
                   const noteEls = annotationContainer.querySelectorAll('.a-row.a-spacing-base');
                   noteEls.forEach(noteEl => {
                       const textEl = noteEl.querySelector('#highlight');
                       const locationEl = noteEl.querySelector('#annotationHighlightHeader');
                       
                       if (textEl) {
                           highlights.push({
                               content: textEl.textContent.trim(),
                               location: locationEl ? locationEl.textContent.trim() : '',
                               color: 'yellow' // default
                           });
                       }
                   });
                }
            }
            
            if (highlights.length > 0) {
                 books.push({
                    title,
                    author,
                    highlights
                });
            }
        });

        if (books.length === 0) {
           // Fallback: Check if we are inside a book view directly without the sidebar loaded nicely?
           // Or just alert the user.
           const currentBookTitle = document.querySelector('.kp-notebook-annotation-book-title')?.textContent.trim();
            const currentAuthor = document.querySelector('.kp-notebook-annotation-author')?.textContent.trim();
            
            if (currentBookTitle) {
                 const highlights = [];
                 const annotationContainer = document.getElementById('kp-notebook-annotations');
                 if (annotationContainer) {
                      const noteEls = annotationContainer.querySelectorAll('.a-row.a-spacing-base');
                       noteEls.forEach(noteEl => {
                           const textEl = noteEl.querySelector('#highlight');
                           const locationEl = noteEl.querySelector('#annotationHighlightHeader');
                           
                           if (textEl) {
                               highlights.push({
                                   content: textEl.textContent.trim(),
                                   location: locationEl ? locationEl.textContent.trim() : '',
                                   color: 'yellow'
                               });
                           }
                       });
                 }
                 
                 if (highlights.length > 0) {
                     books.push({
                        title: currentBookTitle,
                        author: currentAuthor || 'Unknown',
                        highlights
                    });
                 }
            }
        }

        if (books.length === 0) {
            alert('Nenhum destaque encontrado. Selecione um livro na página para carregar seus destaques antes de usar o bookmarklet.');
            return;
        }

        const json = JSON.stringify(books, null, 2);
        
        // Copy to clipboard
        const el = document.createElement('textarea');
        el.value = json;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        
        alert(books.length + ' livro(s) exportado(s)! Os dados foram copiados para sua área de transferência. Volte ao HPC e cole (Ctrl+V) na área de importação.');

    } catch (e) {
        alert('Erro ao exportar: ' + e);
        console.error(e);
    }
})();
`;
