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

  // 把 images 文件夹也原样拷贝到 _site/images
  eleventyConfig.addPassthroughCopy("images");

  // 小说集合：收集 ./fiction 目录下的所有 md 文件
  eleventyConfig.addCollection("fiction", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./fiction/*.md");
  });

  // ✅ 在这里加入 scene 的 paired shortcode
  eleventyConfig.addPairedShortcode(
    "scene",
    function (content, title, imageUrl, audioUrl) {
      const safeTitle = title || "Scene";

      const audioHtml = audioUrl
        ? `
      <div class="scene-audio">
        <div class="scene-audio-label">场景 BGM</div>
        <audio controls preload="none">
          <source src="${audioUrl}" type="audio/mpeg">
          你的浏览器不支持音频播放。
        </audio>
      </div>
      `
        : "";

      return `
      <section class="scene-block">
        <div class="scene-media">
          ${
            imageUrl
              ? `<img src="${imageUrl}" alt="${safeTitle}" loading="lazy">`
              : ""
          }
        </div>
        <div class="scene-text">
          <div class="scene-tag">${safeTitle}</div>
          <div class="scene-body">
            ${content}
          </div>
          ${audioHtml}
        </div>
      </section>
      `;
    }
  );

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
