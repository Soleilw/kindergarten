// pages/personal/checking-in/checking-in.js
var Lunar = require('../../../utils/lunar')
const app = getApp()

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
    attendanceList: [],
    working: true,
    worked: true,
    on_time: '', // 上班时间
    off_time: '', // 下班时间
    t1: '',
    t2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.currentTime();
    this.getAttendance();
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

  dayClick(e) {
    console.log(e);
    var self= this
    var time = e.detail.year + '-' + e.detail.month + '-' + e.detail.day + ' ' + '00:00:00';
    var endTime = e.detail.year + '-' + e.detail.month + '-' + e.detail.day + ' ' + '23:59:59';
    wx.request({
      url: app.globalData.host + '/signs',
      method: 'get',
      data: {
        token: wx.getStorageSync('token'),
        start: time,
        end: endTime
      },
      success: (res) => {
        console.log(res.data.data.length);
        if (res.data.data.length > 0) {
          self.setData({
            t1: res.data.data[0].created_at,
            t2: res.data.data[1].created_at,
          })
        } else {
          self.setData({
            t1: '',
            t2: '',
          })
        }
      }
    })
  },

  // 监听点击下个月事件
  next: function (event) {
    console.log(event.detail);
  },
  // 监听点击上个月事件
  prev: function (event) {
    console.log(event.detail);
  },

  // 获取打卡记录
  getAttendance() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/signs',
      method: 'get',
      data: {
        token: wx.getStorageSync('token'),
      },
      success: (res) => {
        console.log(res.data);
        self.setData({
          attendanceList: res.data.data,
        })
        // if (res.statusCode == 200) {
        //   console.log('获取学校', res);
        // }
      }
    })
  },

  // 手动打卡
  toAttendance(e) {
    var self = this;
    if (self.data.worked) {
      wx.request({
        url: app.globalData.host + '/sign',
        method: 'POST',
        data: {
          token: wx.getStorageSync('token'),
          type: 2,
          status: 1
        },
        success: (res) => {
          if (res.statusCode == 200) {
            console.log(res);
            wx.showToast({
              title: '打卡成功',
              icon: 'none',
              success() {
                self.getAttendance();
                self.setData({
                  working: false,
                  worked: false
                })
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '未到下班打卡时间, 不能打卡',
        icon: 'none'
      })
    }

  },

  // 定时器
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