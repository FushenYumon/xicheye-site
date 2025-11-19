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

    // 其他格式就先简单返回本地化日期
    return d.toLocaleDateString("zh-CN");
  });

  // 告诉 Eleventy：源码在当前目录，输出目录是 _site
  return {
    dir: {
      input: ".",
      output: "_site",
    },
  };
};
