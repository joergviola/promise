const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: ["./docs/.vuepress/theme/**/*.*", "./docs/.vuepress/components/**/*.*", "./!(node_modules)/**/*.md", "./*.md"],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
});

module.exports = {
    base: '/gluon-project.com/',
    title: "gluon-project",
    description: "Project lifecycle management software for service companies",
    plugins:  {
      '@limdongjin/vuepress-plugin-simple-seo': {},
      dehydrate: {
        // disable SSR
        noSSR: [],
        // remove scripts
        noScript: [
          '**/*.html',
        ],
      },
    },
    themeConfig: {
      nav: [
        {
          text: "blogs",
          items: [
            { text: "blog1", link: "/blogs/blog1.md" },
            { text: "blog2", link: "/blogs/blog2.md" }
          ]
        }
      ]
    },
    postcss: {
      plugins: [
        require("autoprefixer"),
        require("tailwindcss")("./tailwind.config.js"),
        ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
      ]
    }
  };