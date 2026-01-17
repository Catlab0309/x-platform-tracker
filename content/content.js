// content/content.js

// 等待页面加载完成
function waitForElement(selector, callback) {
  const observer = new MutationObserver((mutations, obs) => {
    const element = document.querySelector(selector);
    if (element) {
      obs.disconnect();
      callback(element);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 检测点赞行为
function detectLike() {
  waitForElement('[data-testid="like"]', (likeButton) => {
    likeButton.addEventListener('click', (e) => {
      const tweetElement = e.target.closest('[data-testid="tweet"]');
      if (tweetElement) {
        const tweetId = tweetElement.getAttribute('data-tweet-id');
        const tweetText = tweetElement.querySelector('[data-testid="tweetText"]')?.innerText || '';

        const activity = {
          id: Date.now().toString(),
          type: 'like',
          postId: tweetId,
          content: tweetText.substring(0, 100),
          timestamp: Date.now(),
          url: `https://x.com/i/web/status/${tweetId}`
        };

        chrome.runtime.sendMessage({ type: 'LOG_ACTIVITY', activity });
      }
    });
  });
}

// 检测转发行为
function detectRetweet() {
  waitForElement('[data-testid="retweet"]', (retweetButton) => {
    retweetButton.addEventListener('click', (e) => {
      const tweetElement = e.target.closest('[data-testid="tweet"]');
      if (tweetElement) {
        const tweetId = tweetElement.getAttribute('data-tweet-id');
        const tweetText = tweetElement.querySelector('[data-testid="tweetText"]')?.innerText || '';

        const activity = {
          id: Date.now().toString(),
          type: 'retweet',
          postId: tweetId,
          content: tweetText.substring(0, 100),
          timestamp: Date.now(),
          url: `https://x.com/i/web/status/${tweetId}`
        };

        chrome.runtime.sendMessage({ type: 'LOG_ACTIVITY', activity });
      }
    });
  });
}

// 初始化
console.log('X Platform Tracker content script loaded');

// 等待页面加载完成后开始监控
setTimeout(() => {
  detectLike();
  detectRetweet();
}, 2000);
