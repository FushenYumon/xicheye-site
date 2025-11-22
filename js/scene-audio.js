// js/scene-audio.js
// 使用方式：
//  - 小说正文中有若干 <section class="story-scene" data-audio="/audio/xxx.mp3"> ... </section>
//  - 页面顶部有一个同意卡片：#bgm-consent + #bgmConsentBtn
// 流程：
//  1. 用户点击「开启场景背景音乐」按钮 → 视为授权播放
//  2. 脚本找到当前视口中最主要的 story-scene，开始播放对应 BGM（loop）
//  3. 之后滚动到其他 story-scene，会自动切换到对应的 data-audio

document.addEventListener("DOMContentLoaded", () => {
  const scenes = document.querySelectorAll(".story-scene[data-audio]");
  const consentBox = document.getElementById("bgm-consent");
  const consentBtn = document.getElementById("bgmConsentBtn");

  if (!scenes.length || !consentBox || !consentBtn) return;

  const audio = new Audio();
  audio.loop = true;

  let userEnabled = false; // 是否已经点过同意
  let currentSrc = null;

  // 找到当前视口中“最可见”的场景
  function getBestSceneInView() {
    let best = null;
    let bestScore = 0;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    scenes.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const visibleHeight =
        Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visibleHeight <= 0) return;

      const score = visibleHeight * rect.width;
      if (score > bestScore) {
        bestScore = score;
        best = sec;
      }
    });

    return best;
  }

  // 根据当前视口播放合适场景的 BGM
  function playSceneBgmForCurrentView() {
    if (!userEnabled) return;

    const target = getBestSceneInView() || scenes[0];
    if (!target) return;

    const src = target.getAttribute("data-audio");
    if (!src || src === currentSrc) return;

    currentSrc = src;
    audio.src = src;
    audio.currentTime = 0;
    audio
      .play()
      .catch((err) => console.warn("无法播放场景 BGM:", err));
  }

  // 第一次点击按钮：授予播放权限 + 立即按当前视口播放
  consentBtn.addEventListener("click", () => {
    if (userEnabled) return; // 只处理第一次

    userEnabled = true;
    consentBox.classList.add("hidden");

    // 关键：把第一次 audio.play() 放在点击回调里
    const target = getBestSceneInView() || scenes[0];
    if (!target) return;

    const src = target.getAttribute("data-audio");
    if (!src) return;

    currentSrc = src;
    audio.src = src;
    audio.currentTime = 0;

    audio
      .play()
      .then(() => {
        // 播放成功后，开启滚动监听自动切换
        setupObserver();
      })
      .catch((err) => {
        console.warn("首次播放场景 BGM 失败:", err);
      });
  });

  // 使用 IntersectionObserver 监听后续滚动，自动切换场景
  function setupObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!userEnabled) return;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sec = entry.target;
          const src = sec.getAttribute("data-audio");
          if (!src || src === currentSrc) return;

          currentSrc = src;
          audio.src = src;
          audio.currentTime = 0;
          audio
            .play()
            .catch((err) =>
              console.warn("切换场景 BGM 失败:", err)
            );
        });
      },
      {
        threshold: 0.6, // 至少 60% 在视口里算「当前场景」
      }
    );

    scenes.forEach((sec) => observer.observe(sec));

    // 标签页切后台时暂停，回来后继续
    document.addEventListener("visibilitychange", () => {
      if (!userEnabled) return;
      if (document.hidden) {
        audio.pause();
      } else if (currentSrc) {
        audio.play().catch(() => {});
      }
    });
  }

  // 如果用户一开始就已经滚到某个场景，再点按钮也会从当前场景开始播
});
