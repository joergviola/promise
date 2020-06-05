module.exports = {
    base: '/promise/website/docs/.vuepress/dist/',
    title: "gluon-project",
    description: "Project lifecycle management software for service companies",
    plugins:  ['@limdongjin/vuepress-plugin-simple-seo', {}],
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
        require("tailwindcss")("./tailwind.config.js")
      ]
    }
  };