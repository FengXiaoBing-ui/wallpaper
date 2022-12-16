function setPageTitle(title){
    tt.setNavigationBarTitle({
        title: title,
        success: (res) => {
        },
        fail: (res) => {
        },
      });
}

module.exports.setPageTitle = setPageTitle;