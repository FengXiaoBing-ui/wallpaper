// d:\lingfe\xcx\bzhiDome\pages\info\info.js
var Bmob = require('../../utils/title.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    page:1,
    pageSize:18,
  },

  //页面加载
  onLoad: function (options) {
    var that=this;
    that.setData({
      typeName:tt.getStorageSync("typeName"),
      infoData:tt.getStorageSync("infoData")
    });
    this.getImgList();

    //插屏广告
    app.interstitialAd();
  },

  //选择图片
  checkeImg:function(e){
    var that=this;
    that.setData({infoData:that.data.results[e.target.id]});
    tt.setStorageSync("infoData", that.data.infoData);
    tt.showToast({ title:"已选择",icon:"none",duration:800,success:function(res){
      tt.redirectTo({url:"/pages/info/info",});
    }});
  },

  //开启弹窗
  showTip:function (e) {
    this.setData({
      showModal:true
    });
  },

  //隐藏弹窗
  preventHide:function(e){
    this.setData({showModal:false});
    //tt.showToast({ title: "求支持!",icon:"fail",duration:2000});
  },

  //下载
  btnDownload:function(e){  
    var that=this;
    var url=that.data.infoData.sattDir;
    //app.btnDownload(url);
    var indexof=url.indexOf(app.globalData.domainName);
    if(indexof !=-1){
      app.btnDownload(url);
    }else{
      tt.request({
        url: app.globalData.domainName + '/api/public/qrcode/imgUrlSaveFiles',
        data:{
          folder:app.globalData.config.applicationID,
          pid:999,
          imgUrl:url
        },
        success: (res1) => {
          console.log(res1);
          var data=res1.data.data;
          if(data == null ){
            tt.showToast({ title: "请稍后重试!",icon:"fail",duration:2000});
          }else{
            var url999=data[0].url;
            app.btnDownload(url999);
          }
        },
        fail: (res) => {
          tt.showToast({ title: "请稍后重试!",icon:"fail",duration:2000});
        },
      });
    }

    tt.showToast({
      title: '正在处理..',
      icon: 'loading',
    })
  },

  //分享
  btnShare:function(e){
    var that=this;
  },

  //预览
  btnPreview:function(){
    var that=this;
    tt.navigateBack();
  },

  //得到图片列表
  getImgList(pidStr){
    var that=this;
    var flag=true;
    tt.request({
      url: app.globalData.domainName + 'api/public/qrcode/imgList',
      data:{
        pidStr: tt.getStorageSync("pidStr"),
        limit:that.data.pageSize,
        page:that.data.page
      },
      success: (res) => {
        var data=res.data.data.list;
        that.setData({
          results:data,
        });
        flag = false;
      },
      fail: (res) => {
        
      },
    });

    if(flag==true){
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
      })
    }
  },

})