// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const path = require('path')

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Robo Wizard',
  tagline: 'Intuitive, multi-step workflows backed by a state machine',
  url: 'http://robo-wizard.js.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'HipsterBrown', // Usually your GitHub org/user name.
  projectName: 'robo-wizard', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        "entryPoints": path.join(__dirname, '..'),
        "entryPointStrategy": "packages",
        "exclude": "../**/*.test.ts",
        "name": "API",
        "readme": path.join(__dirname, '..', 'README.md'),
        "includeVersion": true,
        "tsconfig": path.join(__dirname, '..', 'tsconfig.json')
      }
    ],
    require.resolve('@cmfcmf/docusaurus-search-local'),
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/HipsterBrown/robo-wizard/docs/docs/',
        },
        blog: {
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/HipsterBrown/robo-wizard/docs/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Robo Wizard',
        items: [
          {
            type: 'doc',
            docId: 'api/index',
            position: 'left',
            label: 'API',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://github.com/HipsterBrown/robo-wizard',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'API',
                to: '/docs/api/index',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} HipsterBrown Creative. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
