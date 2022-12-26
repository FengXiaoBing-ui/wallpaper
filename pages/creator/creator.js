//获取应用实例
var app = getApp();
Page({
  data: {
    lbtList:['blue', 'green', 'red'],
  },
    //页面加载
    onLoad: function (options) {
      var that=this;
      that.setData({
        adUnitIdBanner:app.globalData.config.adUnitIdBanner,
        random:Math.round(Math.random()*9),
        adUnitIdBig:app.globalData.config.adUnitIdBig,
      });
      that.datetimeKozhi();
      that.getIndexData();
      tt.setNavigationBarTitle({title: app.globalData.config.applicationName});
    },
  
    //得到-首页数据
    getIndexData:function(){
      tt.request({
        url:app.globalData.domainName + "api/front/creator/index/indexData",
        data:{
          gidIndexLbt:app.globalData.config.homeLbtGid,
          typeId:0
        },
        success: (res) =>{
          var that=this;
          var data = res.data.data;
          var bannerList = data.bannerList;
          var userList = data.userList;
          var imgList = data.systemAttachmentList;
          that.setData({
            imgList:imgList,
            lbtList:bannerList,
            userList:userList,
          });
        },
        fail: (res) => {},
      });
    },
  
    //banner广告
    datetimeKozhi:function(){
      var that=this;
      let date = app.globalData.datetime2;
      let now = Date.now();
      var date2=date + (1 * 90 * 1000);
      if( date2 < now){
          console.log('超过了当前90s分钟，启动banner广告')
          app.globalData.datetime2=now;
          that.setData({
            adUnitIdBannerRandom:true,
          })
      }else{
        that.setData({
          adUnitIdBannerRandom:false,
        })
        console.log('没有超过当前90s秒，不启动banner广告')
      }
      console.log(date);
      console.log(now);
      console.log(date2);
    },
    //轮播图
  getLbt:function(){
    tt.request({
      url: app.globalData.domainName + "api/public/groupData/get",
      data:{gid:app.globalData.config.homeLbtGid},
      success: (res) => {
        var that=this;
        var data=res.data.data;
        that.setData({
          lbtList:data,
        });
        app.globalData.domainName=data[0].YQZMBZlbtName+"/";
        if(data.length == 3 || data.length == 5 || data.length == 6){
          app.globalData.config.isAdUnitId=true;
          that.setData({
            isAdUnitId:true,
          });
        }
      },
      fail: (res) => {
      },
    });
  },
})