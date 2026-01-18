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
let currentPostContent = ''; // 保存当前发帖内容
let isQuotePost = false; // 标记是否是引用推文
let isReplyPost = false; // 标记是否是回复
let replyPostId = null; // 保存回复的推文ID

function setupEventDelegation() {
  console.log('[X Tracker] Setting up event delegation');

  // 监听输入，保存发帖内容
  document.addEventListener('input', (e) => {
    const target = e.target;

    // 检查是否是发帖框元素
    if (target.getAttribute('data-testid') === 'tweetTextarea_0') {
      if (target.tagName === 'TEXTAREA') {
        currentPostContent = target.value || '';
      } else {
        // DIV with contenteditable
        currentPostContent = target.textContent || target.innerText || '';
      }
      console.log('[X Tracker] Post content updated:', currentPostContent.substring(0, 50));
    }
  });

  // 监听Quote菜单选项的点击
  document.addEventListener('click', (e) => {
    const quoteLink = e.target.closest('a[role="menuitem"]');
    if (quoteLink) {
      const text = quoteLink.textContent || '';
      console.log('[X Tracker] Menu item clicked:', text);
      if (text.includes('Quote') || text.includes('引用')) {
        console.log('[X Tracker] Quote menu detected, marking as quote post');
        isQuotePost = true;
      }
    }
  }, true);

  document.addEventListener('click', (e) => {
    // 检测发帖按钮点击
    const postButton = e.target.closest('[data-testid="tweetButton"]');
    if (postButton && !e.target.closest('[data-testid="tweet"]')) {
      // 点击的是发帖按钮（不是推文中的按钮）
      console.log('[X Tracker] Post button clicked');

      // 如果有保存的内容，记录发帖
      if (currentPostContent && currentPostContent.trim().length > 0) {
        console.log('[X Tracker] Post content:', currentPostContent.substring(0, 100));
        console.log('[X Tracker] Is reply post:', isReplyPost);
        console.log('[X Tracker] Is quote post:', isQuotePost);

        // 确定活动类型
        let activityType = 'post';
        let postId = 'new';
        let url = 'https://x.com/home';

        if (isReplyPost) {
          activityType = 'reply';
          postId = replyPostId || 'new';
          url = replyPostId ? `https://x.com/i/web/status/${replyPostId}` : 'https://x.com/home';
        } else if (isQuotePost) {
          activityType = 'retweet'; // Quote记录为转发
        }

        const activity = {
          id: Date.now().toString(),
          type: activityType,
          postId: postId,
          content: currentPostContent.substring(0, 100),
          timestamp: Date.now(),
          url: url
        };
        console.log('[X Tracker] Sending post activity:', activity);
        chrome.runtime.sendMessage({ type: 'LOG_ACTIVITY', activity }, (response) => {
          console.log('[X Tracker] Response from background:', response);
          if (chrome.runtime.lastError) {
            console.error('[X Tracker] Error sending message:', chrome.runtime.lastError);
          }
        });
        // 清空保存的内容和标记
        currentPostContent = '';
        isReplyPost = false;
        isQuotePost = false;
        replyPostId = null;
      } else {
        console.log('[X Tracker] No post content found');
      }
    }
    console.log('[X Tracker] Click detected on:', e.target.tagName, String(e.target.className).substring(0, 30));
    const tweetElement = e.target.closest('[data-testid="tweet"]');
    console.log('[X Tracker] Tweet element found:', !!tweetElement);

    if (!tweetElement) return;

    const tweetId = getTweetId(tweetElement);
    const tweetText = tweetElement.querySelector('[data-testid="tweetText"]')?.innerText || '';

    const likeButton = e.target.closest('[data-testid="like"], [data-testid="unlike"]');
    const retweetButton = e.target.closest('[data-testid="retweet"]');
    const replyButton = e.target.closest('[data-testid="reply"]');
    const quoteButton = e.target.closest('[aria-label*="Quote"], [aria-label*="引用"]');
    const menuItem = e.target.closest('[role="menuitem"]');

    console.log('[X Tracker] Button detection:');
    console.log('  Like:', !!likeButton);
    console.log('  Retweet:', !!retweetButton);
    console.log('  Reply:', !!replyButton);
    console.log('  Quote:', !!quoteButton);
    console.log('  Menu item:', !!menuItem);

    // 处理回复按钮（用于标记后续的回复框）
    if (replyButton) {
      console.log('[X Tracker] Reply button clicked, marking as reply post');
      isReplyPost = true;
      const tweetElement = replyButton.closest('[data-testid="tweet"]');
      if (tweetElement) {
        replyPostId = getTweetId(tweetElement);
        console.log('[X Tracker] Reply post ID:', replyPostId);
      }
      return; // 只标记，不发送活动
    }

    // 检测菜单选项点击
    if (menuItem) {
      const menuText = menuItem.textContent?.toLowerCase() || '';
      console.log('  Menu text:', menuText);
      console.log('  Menu full text:', menuItem.textContent);
      console.log('  Menu attributes:', Array.from(menuItem.attributes).map(a => a.name + '=' + a.value));
      if (menuText.includes('quote') || menuText.includes('引用')) {
        console.log('[X Tracker] Quote menu item clicked, marking as quote post');
        isQuotePost = true;
      }
      return; // 处理完菜单后返回
    }

    // 检测引用链接点击（备用方案）
    const quoteLink = e.target.closest('a[role="menuitem"]');
    if (quoteLink) {
      const linkText = quoteLink.textContent?.toLowerCase() || '';
      console.log('[X Tracker] Quote link clicked, text:', linkText);
      if (linkText.includes('quote') || linkText.includes('引用')) {
        console.log('[X Tracker] Quote link detected, marking as quote post');
        isQuotePost = true;
      }
      return;
    }

    // 调试：点击了菜单但没有被捕获的情况
    const menuContainer = e.target.closest('[role="menu"]');
    if (menuContainer) {
      console.log('[X Tracker] Clicked inside menu but not captured');
      console.log('  Clicked element:', e.target.tagName);
      console.log('  Element text:', e.target.textContent?.substring(0, 30));
      console.log('  Parent:', e.target.parentElement?.tagName);
    }

    // 检测quote按钮点击（备用方案）
    if (quoteButton) {
      console.log('[X Tracker] Quote button clicked, marking as quote post');
      isQuotePost = true;
      return; // 处理完quote后返回
    }

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
    } else if (quoteButton) {
      console.log('[X Tracker] Quote button clicked, tweetId:', tweetId);
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
  }, true);
}

// 初始化
console.log('X Platform Tracker content script loaded');

// 使用事件委托，立即开始监控
setupEventDelegation();
