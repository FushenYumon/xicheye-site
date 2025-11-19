// .eleventy.js
module.exports = function (eleventyConfig) {
  // 注册一个叫 "date" 的过滤器，给 Nunjucks 模板用
  eleventyConfig.addFilter("date", function (value, format = "yyyy-MM-dd") {
    const d = value instanceof Date ? value : new Date(value);

    if (format === "yyyy-MM-dd") {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
// 确保 admin/config.yml 被原样拷到 _site/admin 下面
  eleventyConfig.addPassthroughCopy("admin/config.yml");
    // 其他格式就先简单返回本地化日期
    return d.toLocaleDateString("zh-CN");
  });

  // 让 Eleventy 原样拷贝 images 目录到 _site/images
  eleventyConfig.addPassthroughCopy("images");

  // 告诉 Eleventy：源码在当前目录，输出目录是 _site
  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site",
    },
  };
};
