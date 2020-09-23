const app = getApp()
let allow_parent_in;
Page({
  data: {
    list: [],
    page: 1
  },
  onLoad: function (options) {
    this.getExamine();
  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      mask: true,
      duration: 1000
    })
  },
  // 获取家长审核列表
  getExamine: function () {
    let that = this;
    wx.request({
      url: app.globalData.host + '/my/parents',
      data: {
        token: wx.getStorageSync('token')
      },
      method: 'get',
      success: function (res) {
        wx.hideToast()
        console.log(res)
        if (res.data.data) {
          that.setData({
            list: res.data.data
          })
        }
      }
    });
  },
  // 查看家长的信息
  toFamilyDetails: function (e) {
    console.log('跳转家长信息页')
    console.log(e);
    let data = e.currentTarget.dataset.info
    console.log(data)
    var info = {
      name: data.name,
      sex: data.sex,
      phone: data.phone,
      id_card: data.id_card,
      address: data.address,
      remark: data.remark,
      href: data.href
    }

    data.relation = e.currentTarget.dataset.relation
    wx.navigateTo({
      url: './family-details/family-details?data=' + JSON.stringify(info)
    })
  },
  // 查看孩子的信息
  toChildrenDetails: function (e) {
    console.log('跳转家长信息页')
    console.log(e);
    let data = e.currentTarget.dataset.info
    console.log(data)
    var info = {
      name: data.name,
      sex: data.sex,
      href: data.face_image,
      number: data.number,
      age: data.age
    }

    wx.navigateTo({
      url: './children-details/children-details?data=' + JSON.stringify(info)
    })
  },
  // 删除
  toDel(e) {
    let self = this;
    console.log(e);
    wx.showModal({
      title: '提示',
      content: '是否删除该家长的申请记录',
      cancelText: '取消',
      confirmText: '删除',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.host + '/apply/into?id=' + e.currentTarget.dataset.id + '&token=' + wx.getStorageSync('token'),
            method: 'delete',
            success: function (res) {
              wx.showToast({
                icon: "none",
                title: '删除成功'
            });
              self.getExamine();
            }
          });
        } else if (res.cancel) {
          wx.showToast({
            icon: "none",
            title: '取消成功'
        });
        }
      }
    })
   
  },
  // 去审核
  toExamine: function (e) {
    let that = this;
    console.log('去审核', e);
    
    wx.showModal({
      title: '家长入园提示',
      content: '是否该家长进园？',
      cancelText: '不允许',
      confirmText: '允许',
      success: function (res) {
        if (res.confirm) {
          that.throughAudit(e.currentTarget.dataset.value)
        } else if (res.cancel) {
          that.NotThroughAudit(e.currentTarget.dataset.value)
        }
      }
    })
  },
  // 通过审核
  throughAudit: function (id) {
    let that = this;
    console.log(id)
    wx.request({
      url: app.globalData.host + '/pass/parents',
      data: {
        token: wx.getStorageSync('token'),
        state: 2,
        id: id
      },
      method: 'post',
      // header: {
      //   "content-type": "application/x-www-form-urlencoded"
      // },
      success: function (res) {
        console.log('通过审核返回')
        console.log(res)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1000
          })
          that.getExamine();
        } else {
          // wx.showModal({ title: '提示', content: res.data.sucesss, showCancel: false, success: function (res) { if (res.confirm) {  })
        }
      }
    });
  },
  // 不通过审核
  NotThroughAudit: function (id) {
    let that = this;
    wx.request({
      url: app.globalData.host + '/pass/parents',
      data: {
        token: wx.getStorageSync('token'),
        state: 3,
        id: id
      },
      method: 'post',
      // header: {
      //   "content-type": "application/x-www-form-urlencoded"
      // },
      success: function (res) {
        console.log('不通过审核返回')
        console.log(res)
        if (res.statusCode == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            duration: 1000
          })
          that.getExamine();
        }
        //  else {
        //   wx.showToast({ title: res.data.error, icon: 'success', duration: 1000 })
        // }
      }
    });
  }

})