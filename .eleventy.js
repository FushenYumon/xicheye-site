module.exports = function(eleventyConfig) {
  // 把现有的静态资源直接拷贝过去
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("admin");

  // 自定义一个 blog 集合：所有 blog/posts/*.md 文件
  eleventyConfig.addCollection("blog", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("blog/posts/*.md")
      .sort((a, b) => b.date - a.date); // 按时间倒序
  });

  return {
    dir: {
      input: ".",     // 输入：当前仓库
      output: "_site" // 输出目录：_site
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
};
