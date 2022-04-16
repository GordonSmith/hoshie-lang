
function getGuideSidebar() {
    return [
        {
            text: "Introduction",
            children: [
                { text: "Getting Started", link: "/README" }
            ]
        },
        {
            text: "Contributing",
            children: [{ text: "Contributing", link: "/docs/contributing" }]
        }
    ];
}

// Keep in sync with:  ../lang-ref/README.md

function getLangRefSidebar() {
    return [
        //  --- Sample Sidebar ---
        // {
        //     text: "Editors",
        //     children: [
        //         { text: "CodeMirror", link: "/lang-ref/editor/src/codemirror" },
        //         { text: "Preview", link: "/lang-ref/preview/src/preview" },
        //     ]
        // }, {
        //     text: "Layouts",
        //     children: [
        //         { text: "Getting Started", link: "/lang-ref/layout/README" },
        //         { text: "Dock Panel", link: "/lang-ref/layout/src/lumino/dockPanel" },
        //         { text: "Drag and Zoom", link: "/lang-ref/layout/src/zoom" },
        //         { text: "Split Panel", link: "/lang-ref/layout/src/lumino/splitPanel" },
        //         { text: "Tab Panel", link: "/lang-ref/layout/src/lumino/tabPanel" },
        //     ]
        // }
    ];
}

module.exports = {
    lang: "en-US",
    title: "@AlexSmith/hoshie-lang",
    description: "A declarative data processing language",
    base: "/hoshie-lang/",

    head: [
        ['link', { rel: 'icon', type: 'image/x-icon', href: '/hoshie-lang/resources/favicon.ico' }],
    ],

    themeConfig: {
        repo: "AlexSmith/hoshie-lang",
        docsDir: "",
        docsBranch: "main",
        editLinks: true,
        editLinkText: "Edit this page on GitHub",
        lastUpdated: "Last Updated",

        nav: [
            {
                text: "Guide",
                link: "/README",
                activeMatch: "^/README"
            },
            {
                text: "Language Reference",
                link: "/docs/lang-ref/index",
                activeMatch: "^/docs/lang-ref/"
            },
            {
                text: "Release Notes",
                link: "https://github.com/AlexSmith/hoshie-lang/releases"
            }
        ],

        sidebar: {
            "/README": getGuideSidebar(),
            "/lang-ref": getLangRefSidebar(),
        }
    },

    vite: {
        cacheDir: "./.vitepress/cache",
        server: {
            fs: {
                strict: false
            }
        },
        resolve: {
            alias: {
            }
        },
        plugins: [
        ]
    },

    vue: {
        template: {
            compilerOptions: {
                isCustomElement: (tag) => {
                    return tag.toLowerCase().indexOf("hpcc-") === 0;
                }
            }
        }
    },

    markdown: {
        config: (md) => {
            //  --- Markdown Plugins - this is were Hoshie Lang support can go ---
        }
    }
};
