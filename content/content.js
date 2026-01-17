// content/content.js

// 从推文元素中提取ID
function getTweetId(tweetElement) {
  const statusLink = tweetElement.querySelector('a[href*="/status/"]');
  if (statusLink) {
    const match = statusLink.href.match(/\/status\/(\d+)/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// 监控页面变化，为新添加的推文绑定事件
function setupEventDelegation() {
  document.addEventListener('click', (e) => {
    const tweetElement = e.target.closest('[data-testid="tweet"]');
    if (!tweetElement) return;

    const tweetId = getTweetId(tweetElement);
    const tweetText = tweetElement.querySelector('[data-testid="tweetText"]')?.innerText || '';

    const likeButton = e.target.closest('[data-testid="like"], [data-testid="unlike"]');
    const retweetButton = e.target.closest('[data-testid="retweet"]');

    if (likeButton) {
      console.log('[X Tracker] Like/Unlike button clicked, tweetId:', tweetId);
      if (!tweetId) {
        console.error('[X Tracker] Could not find tweet ID');
        return;
      }
      const activity = {
        id: Date.now().toString(),
        type: 'like',
        postId: tweetId,
        content: tweetText.substring(0, 100),
        timestamp: Date.now(),
        url: `https://x.com/i/web/status/${tweetId}`
      };
      console.log('[X Tracker] Sending activity:', activity);
      chrome.runtime.sendMessage({ type: 'LOG_ACTIVITY', activity }, (response) => {
        console.log('[X Tracker] Response from background:', response);
        if (chrome.runtime.lastError) {
          console.error('[X Tracker] Error sending message:', chrome.runtime.lastError);
        }
      });
    } else if (retweetButton) {
      console.log('[X Tracker] Retweet button clicked, tweetId:', tweetId);
      if (!tweetId) {
        console.error('[X Tracker] Could not find tweet ID');
        return;
      }
      const activity = {
        id: Date.now().toString(),
        type: 'retweet',
        postId: tweetId,
        content: tweetText.substring(0, 100),
        timestamp: Date.now(),
        url: `https://x.com/i/web/status/${tweetId}`
      };
      console.log('[X Tracker] Sending activity:', activity);
      chrome.runtime.sendMessage({ type: 'LOG_ACTIVITY', activity }, (response) => {
        console.log('[X Tracker] Response from background:', response);
        if (chrome.runtime.lastError) {
          console.error('[X Tracker] Error sending message:', chrome.runtime.lastError);
        }
      });
    }
  });
}

// 初始化
console.log('X Platform Tracker content script loaded');

// 使用事件委托，立即开始监控
setupEventDelegation();
