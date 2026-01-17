// 查找推文ID的正确属性

console.log('=== 查找推文ID属性 ===\n');

const tweets = document.querySelectorAll('[data-testid="tweet"]');
if (tweets.length > 0) {
  const tweet = tweets[0];
  console.log('推文元素:', tweet);
  console.log('\n推文的所有属性:');

  // 列出所有属性
  for (let attr of tweet.attributes) {
    if (attr.name.includes('id') || attr.name.includes('Id')) {
      console.log(`  ${attr.name}: ${attr.value}`);
    }
  }

  console.log('\n推文的完整属性列表:');
  for (let attr of tweet.attributes) {
    console.log(`  ${attr.name}: ${attr.value}`);
  }

  // 检查是否有其他可能的ID属性
  console.log('\n查找可能的ID属性:');
  console.log('  id:', tweet.id);
  console.log('  className:', tweet.className);

  // 查找链接
  const links = tweet.querySelectorAll('a[href*="/status/"]');
  if (links.length > 0) {
    console.log('\n找到状态链接:');
    links.forEach(link => {
      console.log('  ', link.href);
      const match = link.href.match(/\/status\/(\d+)/);
      if (match) {
        console.log('  提取的ID:', match[1]);
      }
    });
  }
}
