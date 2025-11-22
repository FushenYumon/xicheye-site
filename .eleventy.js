// .eleventy.js
module.exports = function (eleventyConfig) {
  // 日期过滤器：{{ page.date | date("yyyy-MM-dd") }}
  eleventyConfig.addFilter("date", function (value, format = "yyyy-MM-dd") {
    const d = value instanceof Date ? value : new Date(value);

    if (format === "yyyy-MM-dd") {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    return d.toLocaleDateString("zh-CN");
  });

  // 把这些资源原样拷贝到 _site 下
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("audio");
  eleventyConfig.addPassthroughCopy("js");

  // 小说集合：收集 ./fiction 目录下所有 md
  eleventyConfig.addCollection("fiction", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./fiction/*.md");
  });

  // 场景块 shortcode：以后想用的话可以继续用 {% scene %}...{% endscene %}
  eleventyConfig.addPairedShortcode(
    "scene",
    function (content, title, imagePath, audioPath) {
      const safeTitle = title || "";
      const safeImage = imagePath || "";
      const safeAudio = audioPath || "";

      const dataAttr = safeAudio
        ? ` data-audio="${safeAudio}"`
        : "";

      const imageHTML = safeImage
        ? `<div class="scene-media">
             <img src="${safeImage}" alt="${safeTitle || "场景插图"}" loading="lazy">
           </div>`
        : "";

      const labelHTML = safeTitle
        ? `<div class="scene-label">${safeTitle}</div>`
        : "";

      return `
<section class="story-scene"${dataAttr}>
  ${imageHTML}
  <div class="scene-text">
    ${labelHTML}
    <div class="scene-body">
      ${content}
    </div>
  </div>
</section>
`;
    }
  );

  return {
    dir: {
      input: ".",       // 源码目录
      includes: "_includes",
      output: "_site",  // 输出目录
    },
    // 重要：让 html / md 都用 Nunjucks 模板引擎，这样下面的 {{ }} / {% %} 能正确解析
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
