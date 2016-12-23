export const wechatShare = function({
  title,
  link,
  desc,
}) {
  wx.onMenuShareTimeline({
    title,
    link,
  })
  wx.onMenuShareAppMessage({
    title,
    desc,
    link,
  });
}
