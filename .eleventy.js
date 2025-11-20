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

  // Admin 后台、图片、音乐文件原样拷贝到 _site
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("audio");

  // 小说集合：收集 ./fiction 目录下所有 md
  eleventyConfig.addCollection("fiction", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./fiction/*.md");
  });

  // ✅ 场景块 shortcode：{% scene "标题", "/images/xxx.jpg", "/audio/yyy.mp3" %} ... {% endscene %}
  // 这里不再渲染 <audio> 播放器，而是给场景加 data-scene-bgm，交给全局 JS 自动播放
  eleventyConfig.addPairedShortcode(
    "scene",
    function (content, title, imagePath, audioPath) {
      const safeTitle = title || "";
      const safeImage = imagePath || "";
      const safeAudio = audioPath || "";

      const dataAttr = safeAudio
        ? ` data-scene-bgm="${safeAudio}"`
        : "";

      const imageHTML = safeImage
        ? `<div class="scene-media">
             <img src="${safeImage}" alt="${safeTitle || "场景插图"}" loading="lazy">
           </div>`
        : "";

      return `
<section class="scene-block"${dataAttr}>
  ${imageHTML}
  <div class="scene-text">
    ${
      safeTitle
        ? `<div class="scene-tag">${safeTitle}</div>`
        : ""
    }
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
  };
};
