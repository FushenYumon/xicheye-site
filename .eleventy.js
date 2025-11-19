// .eleventy.js
module.exports = function (eleventyConfig) {
  // 自定义一个 "date" 过滤器，给 Nunjucks 用
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

  // 关键：让 Eleventy 直接把 admin 文件夹拷贝到 _site 里
  eleventyConfig.addPassthroughCopy("admin");

  // 如果以后有静态图片之类，也可以这样：
  // eleventyConfig.addPassthroughCopy("images");

  return {
    dir: {
      input: ".",      // 源码在当前目录
      includes: "_includes",
      output: "_site", // 输出目录
    },
  };
};
