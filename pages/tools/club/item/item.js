const app = getApp()
const { getClubItem,starClub } = require('../../../api/other')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    exist:true,
    article:'http://mp.weixin.qq.com/s?__biz=MzI1NTUwNDIzNQ==&mid=100002184&idx=1&sn=e2270b415d6581bbe4e2ec54da0df7a3&chksm=6a35b38c5d423a9a108c4318d9913ec93e9fa8a72fe608c138b701644d37620df203a9921d2f#rd'
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let stared = options.stared || false
    if(id <= 0){
      this.setData({
        loading:false,
        exist: false
      })
      return
    }
    this.setData({
      id,
      stared
    })
    this.getItem()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "欢迎加入我们" + this.data.club.name,
      imageUrl: this.data.club.logo,
      path: `/pages/tools/club/item/item?id=${this.data.id}`
    }
  },

  //获取详情
  getItem:function(){
    let _this = this
    getClubItem({
      id:_this.data.id,
    }).then((res) => {
      if(res.status == 0){
        let item = res.data
        if(item.displayed == 0 || item.deleted == 1){
          app.msg("该社团不存在")
          return
        }
        _this.setData({
          loading: false,
          exist: true,
          club: item
        })
        return
      }
      _this.setData({
        loading: false,
        exist: false
      })
    })
  },

  // 点赞
  star:function(){
    let _this = this
    let stu_id = wx.getStorageSync('user_id')
    if(stu_id == ''){
      app.msg("登录后才能点赞哦")
      return
    }
    if(_this.data.stared == 1){
      app.msg("你已经点过赞啦！")
      return
    }
    starClub({
      cid: _this.data.id,
      stu_id:stu_id
    }).then((res) => {
      if(res.status == 0){
        app.msg(res.message)
        let club = _this.data.club
        club.star++
        _this.setData({
          stared:1,
          club:club
        })
      }
    })
  },

  viewPhotos:function(){
    if(this.data.club.photos == ''){
      app.msg("暂无照片")
      return
    }
    let photos = JSON.parse(this.data.club.photos)
    if(photos.length == 0){
      app.msg("暂无照片")
      return
    }
    wx.previewImage({
      current: photos[0],
      urls: photos
    })
  },

  edit:function(){
    openArticle(this.data.article)
  }
})