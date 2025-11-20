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
  eleventyConfig.addPairedShortcode(
    "scene",
    function (content, title, imagePath, audioPath) {
      const safeTitle = title || "";

      const imageHTML = imagePath
        ? `<div class="scene-media">
             <img src="${imagePath}" alt="${safeTitle || "场景插图"}">
           </div>`
        : "";

      const audioHTML = audioPath
        ? `<div class="scene-audio">
             <div class="scene-audio-label">场景音乐</div>
             <audio controls preload="none">
               <source src="${audioPath}" type="audio/mpeg">
               你的浏览器不支持音频播放。
             </audio>
           </div>`
        : "";

      return `
<section class="scene-block">
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
    ${audioHTML}
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
