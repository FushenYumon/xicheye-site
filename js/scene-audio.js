// js/scene-audio.js
// 功能：
//  - 找到所有 .story-scene 且带 data-audio 的元素
//  - 当某个场景进入视口时，自动播放对应 BGM（循环）
//  - 离开视口或页面切到后台时暂停
document.addEventListener("DOMContentLoaded", () => {
  const scenes = document.querySelectorAll(".story-scene[data-audio]");
  if (!scenes.length) return;

  // 只使用一个全局 Audio 实例
  const bgm = new Audio();
  bgm.loop = true;
  let currentSrc = null;

  // 标记用户是否有过交互，避免部分浏览器拦截
  let interacted = false;
  const markInteracted = () => {
    interacted = true;
    window.removeEventListener("click", markInteracted);
    window.removeEventListener("keydown", markInteracted);
  };
  window.addEventListener("click", markInteracted);
  window.addEventListener("keydown", markInteracted);

  const tryPlay = () => {
    const p = bgm.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        // 被浏览器静默拦截就算了，不弹错误
      });
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      let best = null;
      let bestRatio = 0;

      entries.forEach((entry) => {
        if (entry.intersectionRatio > bestRatio) {
          best = entry;
          bestRatio = entry.intersectionRatio;
        }
      });

      if (!best) return;

      if (best.isIntersecting) {
        const src = best.target.getAttribute("data-audio");
        if (src && src !== currentSrc) {
          currentSrc = src;
          bgm.src = src;

          if (interacted) {
            tryPlay();
          } else {
            // 有些浏览器把滚动也当作交互，可以先试一次
            tryPlay();
          }
        }
      } else {
        // 当所有场景都不在视口内时，暂停
        const anyVisible = Array.from(scenes).some((scene) => {
          const rect = scene.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });
        if (!anyVisible) {
          bgm.pause();
        }
      }
    },
    {
      threshold: [0.4, 0.6, 0.8], // 至少有 40% 在视口里才算“进入”
    }
  );

  scenes.forEach((scene) => observer.observe(scene));

  // 标签页切到后台时暂停
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      bgm.pause();
    }
  });
});
