// pages/personal/checking-in/checking-in.js
var Lunar = require('../../../utils/lunar')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTime: '',
    daysColor: [{
      month: 'current', // 要标记的日期所属月份，有效值有prev（上个月）,current（当前月），next（下个月）
      day: new Date().getDate(), // 要标记的日期
      color: 'white', // 白色
      background: "#2a9f93" //日期单元格的颜色
    }], // 日历
    show: false,
    showTime: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.currentTime();
    // 当前时间
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let gregorian = Lunar.getdateTime(year, month, date); // 星期
    let lunar = Lunar.toLunar(year, month, date); // 农历
  },

  showCaledar() {
    var self = this;
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      show: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  closeCaledar() {
    var self = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        show: false
      })
    }.bind(this), 200)
  },

  currentTime() {
    setInterval(this.getDate, 500);
  },

  getDate() {
    var self = this;
    let hh = new Date().getHours();
    let mf =
      new Date().getMinutes() < 10 ?
      "0" + new Date().getMinutes() :
      new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds();
    self.setData({
      nowTime: hh + ":" + mf + ":" + ss
    })
  },

  // 销毁定时器
  beforeDestroy: function () {
    if (this.getDate) {
      clearInterval(this.getDate);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})