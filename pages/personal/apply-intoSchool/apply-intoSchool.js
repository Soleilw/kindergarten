const app = getApp()
// pages/showh5.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schools: [],
    grades: [],
    classes: [],
    select_school: null,
    select_grade: null,
    userInfo: {
      school_id: 0,
      class_id: 0,
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSchoolsList();
    this.getGradeList();
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

  // 获取学校
  getSchoolsList: function () {
    let self = this;
    wx.request({
      url: app.globalData.host + '/schools?page=1&&limit=1000',
      method: 'GET',
      success: (res) => {
        if (res.statusCode == 200) {
          console.log('获取学校', res);

          self.setData({
            schools: res.data.data.data,
          })
        }
      }
    })
  },

  // 获取年级
  getGradeList: function (select_school) {
    let self = this;
    wx.request({
      url: app.globalData.host + '/grades?page=1&&limit=1000&&school_id=' + select_school,
      method: 'GET',
      success: (res) => {
        if (res.statusCode == 200) {
          console.log('获取年级', res);

          self.setData({
            grades: res.data.data.data
          })
        }
      }
    })
  },

  // 选择学校
  bindSchoolChange: function (e) {
    let self = this;
    self.data.userInfo.school_id = self.data.schools[e.detail.value].id
    self.data.userInfo.school = self.data.schools[e.detail.value].name
    self.setData({
      select_school: e.detail.value,
      userInfo: self.data.userInfo,
    })
    console.log('选择学校', self.data.select_school);

    self.getGradeList(self.data.schools[e.detail.value].id);
  },

  // 选择年级
  gradeChange: function (e) {
    let self = this;
    self.data.userInfo.grade = self.data.grades[e.detail.value].title
    self.setData({
      userInfo: self.data.userInfo,
      select_grade: e.detail.value,
    })
    self.getClassList(e.detail.value);
  },

  // 根据年级获取班级列表
  getClassList: function (num) {
    console.log(num)
    let self = this;
    wx.request({
      url: app.globalData.host + '/classes?page=1&&limit=1000&&grade_id=' + self.data.grades[num].id,
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          console.log(res.data.data.data)
          self.setData({
            classes: res.data.data.data,
          })
        }
      }
    });
  },

  // 选择班级
  classChange: function (e) {
    let self = this;
    self.data.userInfo.class_id = self.data.classes[e.detail.value].id
    self.data.userInfo.class = self.data.classes[e.detail.value].title
    self.setData({
      select_class: e.detail.value,
      userInfo: self.data.userInfo,
    })
  },

  // 申请进校
  submitApply() {
    var self = this;
    wx.request({
      url: app.globalData.host + '/apply/into',
      data: {
        token: wx.getStorageSync('token'),
        school_id: self.data.userInfo.school_id,
        class_id: self.data.userInfo.class_id
      },
      method: 'POST',
      success: (res) => {
        if (res.statusCode == 200) {
          console.log('申请进校', res);
          wx.showModal({
            title: '提示',
            content: '申请成功, 请联系班主任审核, 审核通过方可进校',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.statusCode == 422) {
          wx.showModal({
            title: '提示',
            cancel: false,
            content: '申请记录已存在，请联系班主任审核',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })
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