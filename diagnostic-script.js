// 诊断脚本 - 在X.com的Console中运行

console.log('=== X Platform DOM 诊断开始 ===\n');

// 1. 检查推文容器
const tweets = document.querySelectorAll('[data-testid="tweet"]');
console.log('推文容器数量:', tweets.length);
if (tweets.length > 0) {
  console.log('第一个推文容器:', tweets[0]);
  console.log('第一个推文的tweet-id:', tweets[0].getAttribute('data-tweet-id'));
}

// 2. 检查所有可能的按钮类型
console.log('\n=== 按钮统计 ===');
const likeButtons = document.querySelectorAll('[data-testid="like"]');
console.log('点赞按钮 (data-testid="like"):', likeButtons.length);

const retweetButtons = document.querySelectorAll('[data-testid="retweet"]');
console.log('转发按钮 (data-testid="retweet"):', retweetButtons.length);

const replyButtons = document.querySelectorAll('[data-testid="reply"]');
console.log('回复按钮 (data-testid="reply"):', replyButtons.length);

// 3. 列出所有data-testid属性
console.log('\n=== 所有data-testid属性 ===');
const allTestIds = new Set();
document.querySelectorAll('[data-testid]').forEach(el => {
  const id = el.getAttribute('data-testid');
  if (id && !id.startsWith('app-text')) {
    allTestIds.add(id);
  }
});
console.log(Array.from(allTestIds).sort());

// 4. 尝试找到SVG图标
console.log('\n=== SVG图标 ===');
const svgIcons = document.querySelectorAll('svg.r-4qtqp9');
console.log('SVG图标数量:', svgIcons.length);
if (svgIcons.length > 0) {
  console.log('第一个SVG:', svgIcons[0]);
  console.log('SVG父元素:', svgIcons[0].parentElement);
  console.log('SVG祖父元素:', svgIcons[0].parentElement?.parentElement);
}

// 5. 查找包含"喜欢"、"回复"、"转发"文字的元素
console.log('\n=== 查找操作按钮组 ===');
const actionBars = document.querySelectorAll('[role="group"]');
console.log('操作按钮组数量:', actionBars.length);
if (actionBars.length > 0) {
  console.log('第一个操作组:', actionBars[0].outerHTML.substring(0, 300));
}

console.log('\n=== 诊断结束 ===');
