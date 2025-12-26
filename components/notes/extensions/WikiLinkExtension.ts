
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { PluginKey } from 'prosemirror-state';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import SuggestionList from './SuggestionList';

export const WikiLinkExtension = (searchNotes: (query: string) => Promise<any[]>) => Extension.create({
    name: 'wikiLink',

    addOptions() {
        return {
            suggestion: {
                char: '[[',
                pluginKey: new PluginKey('wikiLinkSuggestion'),
                items: async ({ query }: { query: string }) => {
                    return await searchNotes(query);
                },
                render: () => {
                    let component: ReactRenderer;
                    let popup: any;

                    return {
                        onStart: (props: any) => {
                            component = new ReactRenderer(SuggestionList, {
                                props,
                                editor: props.editor,
                            });

                            if (!props.clientRect) {
                                return;
                            }

                            popup = tippy('body', {
                                getReferenceClientRect: props.clientRect,
                                appendTo: () => document.body,
                                content: component.element,
                                showOnCreate: true,
                                interactive: true,
                                trigger: 'manual',
                                placement: 'bottom-start',
                            });
                        },

                        onUpdate(props: any) {
                            component.updateProps(props);

                            if (!props.clientRect) {
                                return;
                            }

                            popup[0].setProps({
                                getReferenceClientRect: props.clientRect,
                            });
                        },

                        onKeyDown(props: any) {
                            if (props.event.key === 'Escape') {
                                popup[0].hide();
                                return true;
                            }

                            return (component.ref as any)?.onKeyDown(props);
                        },

                        onExit() {
                            popup[0].destroy();
                            component.destroy();
                        },
                    };
                },
                command: ({ editor, range, props }: any) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setLink({ href: `#note/${props.id}`, class: 'text-blue-500 hover:underline font-medium cursor-pointer', target: '_self' })
                        .insertContent(props.label)
                        .unsetLink()
                        .insertContent(' ')
                        .run();
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});
