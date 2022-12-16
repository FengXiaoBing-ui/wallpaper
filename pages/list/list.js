// d:\lingfe\xcx\bzhiDome\pages\list\list.js
var Bmob = require('../../utils/title.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    p_type:null,
    urllist:[],
    p_type:'',
    index:0,
    page:1,
    pageSize:24,
    results:[],
    contentIsNull:false,
    contentItems: ['', '', '', ''],
    listItems: ['', '', '']
  },

  //页面加载
  onLoad: function (options) {
    var that=this;
    console.log(options);
    that.setData({
      index:options.pid,
      classType:options.classtype,
      pid:options.pid,
      gid:options.gid,
      typeName:options.title,
      isAdUnitId:app.globalData.config.isAdUnitId,
      adUnitIdBig:app.globalData.config.adUnitIdBig,
      random:Math.round(Math.random()*9),
    });

    console.log("pid=", options.pid);
    console.log("gid=", options.gid);
    console.log("title=", options.title);
    Bmob.setPageTitle(options.title);
    this.getTypeImgList(that);
    this.getTypeListTabs();
  },

  //得到导航分类菜单
  getTypeListTabs:function(){
    tt.request({
      url: app.globalData.domainName + "api/public/groupData/get",
      data:{gid:app.globalData.config.applicationTypeMenuGid},
      success: (res) => {
        var that=this;
        that.setData({
          cardInfoListTabs:res.data.data
        });
      },
      fail: (res) => {
      },
    });
  },

  //跳转到详情页
  btnInfo:function(e){
    var that=this;
    var infoData= {
      pid:e.target.id,
      sattDir:e.target.dataset.path,
      name:e.target.dataset.name
    };
    tt.setStorageSync("typeName", that.data.typeName);
    tt.setStorageSync("infoData", infoData);
    tt.setStorageSync("pidStr", that.data.pidStr);
    if( that.data.classType == 4 ){
      tt.navigateTo({
        url: "/pages/homeInfo2/homeInfo",
      });
    }else{
      tt.navigateTo({
        url: "/pages/info2/info",
      });
    }
  },

  //得到分类列表
  getTypeImgList(that){
    tt.request({
      url: app.globalData.domainName + "api/public/groupData/get",
      data:{gid:that.data.gid},
      success: (res) => {
        var that=this;
        var data=res.data.data;
        let pidStr = data.map((item) =>{
          return item.YQZMBZindexTypeID;
        });
        that.setData({
          cardInfoList:data,
          pidStr:pidStr,
          pidStrBF:pidStr,
        });
        this.getImgList(pidStr);
      },
      fail: (res) => {
        
      },
    });
  },

  //点击分类
  btnTypeImg:function(e){
    var that=this;
    that.setData({
      index:e.target.id,
      page:1,
      classType:e.target.dataset.classType,
    });
    Bmob.setPageTitle(e.target.dataset.title);
    if("全部" === e.target.dataset.title ){
      that.setData({
        pidStr:that.data.pidStrBF
      });
      this.getImgList(that.data.pidStr);
    }else{
      that.setData({pidStr:e.target.id});
      this.getImgList(e.target.id);
    }
  },

  //得到图片列表
  getImgList(pidStr){
    var that=this;
    var flag=true;
    tt.request({
      url: app.globalData.domainName + 'api/public/qrcode/imgList',
      data:{
        pidStr:pidStr,
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

  //下拉加载
  lower: function () {
    console.log("到达底部");
    var that = this;
    var flag = true;
    var page=that.data.page;
    page++;

    // 查询所有数据
    tt.request({
      url: app.globalData.domainName + 'api/public/qrcode/imgList',
      data:{
        pidStr:that.data.pidStr,
        limit:that.data.pageSize,
        page:page
      },
      success: (res) => {
        that.setData({
          page:page,
          results: that.data.results.concat(res.data.data.list),
        });
        flag = false;
      },
      fail: (res) => {
      },
    });
    if(flag == true) {
      wx.showToast({
        title: '正在加载',
        icon: 'loading',
      })
    }
  },

  //预览
  bindPicture: function (res) {
    console.log("imgsrc=");
    console.log(res.target.dataset.imgsrc)
    var current = res.target.dataset.imgsrc;
    wx.previewImage({
      current: current,
       urls: this.data.urllist // 需要预览的图片http链接列表
    })
  },
 
})