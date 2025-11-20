// .eleventy.js
module.exports = function (eleventyConfig) {
  // 自定义一个 "date" 过滤器, 给 Nunjucks 用
  eleventyConfig.addFilter("date", function (value, format = "yyyy-MM-dd") {
    const d = value instanceof Date ? value : new Date(value);

    if (format === "yyyy-MM-dd") {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    // 其他情况就用本地日期格式
    return d.toLocaleDateString("zh-CN");
  });

  // 让 Eleventy 直接把 admin 文件夹拷贝到 _site
  eleventyConfig.addPassthroughCopy("admin");

  // 关键：把 images 文件夹也原样拷贝到 _site/images
  eleventyConfig.addPassthroughCopy("images");
  // 小说集合：收集 ./fiction 目录下的所有 md 文件
  eleventyConfig.addCollection("fiction", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./fiction/*.md");
  });

  // 确保 audio 目录里的音乐文件也会被拷贝
  eleventyConfig.addPassthroughCopy("audio");
  return {
    dir: {
      input: ".",          // 源码在当前目录
      includes: "_includes",
      output: "_site",     // 输出目录
    },
  };
};
