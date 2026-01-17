// content/content.js

// 监控页面变化，为新添加的推文绑定事件
function setupEventDelegation() {
  document.addEventListener('click', (e) => {
    const tweetElement = e.target.closest('[data-testid="tweet"]');
    if (!tweetElement) return;

    const tweetId = tweetElement.getAttribute('data-tweet-id');
    const tweetText = tweetElement.querySelector('[data-testid="tweetText"]')?.innerText || '';

    const likeButton = e.target.closest('[data-testid="like"]');
    const retweetButton = e.target.closest('[data-testid="retweet"]');

    if (likeButton) {
      const activity = {
        id: Date.now().toString(),
        type: 'like',
        postId: tweetId,
        content: tweetText.substring(0, 100),
        timestamp: Date.now(),
        url: `https://x.com/i/web/status/${tweetId}`
      };
      chrome.runtime.sendMessage({ type: 'LOG_ACTIVITY', activity });
    } else if (retweetButton) {
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
}

// 初始化
console.log('X Platform Tracker content script loaded');

// 使用事件委托，立即开始监控
setupEventDelegation();
