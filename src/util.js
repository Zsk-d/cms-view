import urls from "./urls";
const util = {}
util.getFetch = (url, method, okCallback, errorCallback, data, headers) => {
  let option = {
    method: method,
    credentials: 'include'
  };
  if (data) {
    option.body = data;
  }
  if (headers) {
    option.headers = headers;
  }
  fetch(urls.serverAddr+urls.prev + url, option)
    .then(response => response.json())
    .then(response => {
      if (response.status == -1) {
        if (window.needLogin == 1) {
          window.needLogin = 1;
        }
        util.logout();
      } else if (response.status == -2) {
        util.logout();
      } else {
        if (okCallback) okCallback(response);
      }
    })
    .catch(error => {
      if (errorCallback) errorCallback(error);
    });
}
util.getJsonPost = (url, okCallback, errorCallback, data) => {
  util.getFetch(url, "POST", okCallback, errorCallback, JSON.stringify(data), util.fetchConfig.contentTypeJson);
}
util.getJsonDelete = (url, okCallback, errorCallback, data) => {
  util.getFetch(url, "DELETE", okCallback, errorCallback);
}
util.getJsonGet = (url, okCallback, errorCallback) => {
  util.getFetch(url, "GET", okCallback, errorCallback, null, null);
}
util.fetchConfig = {
  contentTypeJson: {
    'content-type': 'application/json'
  },
  contentTypeText: {
    'content-type': 'application/txt'
  }
};
util.elMessageType = {
  sec: "success",
  msg: "message",
  warn: "warning",
  error: "error"
}
util.formatJson = (json) => {
  let formatted = '',
    padIdx = 0,
    PADDING = '    ';
  if (typeof json !== 'string') {
    json = JSON.stringify(json);
  }
  json = json.replace(/([\{\}])/g, '\r\n$1\r\n').replace(/([\[\]])/g, '\r\n$1\r\n').replace(/(\,)/g, '$1\r\n').replace(/(\r\n\r\n)/g, '\r\n').replace(/\r\n\,/g, ',');
  (json.split('\r\n')).forEach(function (node, index) {
    let indent = 0,
      padding = '';
    if (node.match(/\{$/) || node.match(/\[$/)) indent = 1;
    else if (node.match(/\}/) || node.match(/\]/)) padIdx = padIdx !== 0 ? --padIdx : padIdx;
    else indent = 0;
    for (let i = 0; i < padIdx; i++) padding += PADDING;
    formatted += padding + node + '\r\n';
    padIdx += indent;
  });
  return formatted;
};
util.deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
}
util.showMessage = (context, str, type, duration) => {
  context.$message({
    message: str,
    type: type,
    duration: duration ? duration : type == "error" ? 5000 : 2000
  })
}
util.getSession = (key) => {
  return sessionStorage.getItem(key);
}
util.getObjSession = (key) => {
  return JSON.parse(util.getSession(key));
}
util.setSession = (key, value) => {
  return sessionStorage.setItem(key, typeof (value) == "string" ? value : JSON.stringify(value));
}
util.clearSession = () => {
  sessionStorage.clear();
}
util.numberTransColName = (number) => {
  let pr = null;
  if (number > 26) {
    pr = util.numberTransColName(Math.floor(number / 26) - 1);
    number = number % 26;
  }
  var ordA = 'A'.charCodeAt(0);
  var ordZ = 'Z'.charCodeAt(0);
  var len = ordZ - ordA + 1;
  var s = "";
  while (number >= 0) {
    s = String.fromCharCode(number % len + ordA) + s;
    number = Math.floor(number / len) - 1;
  }
  if (pr != null) {
    s = pr + s;
  }
  return s;
}
util.logout = () => {
  util.clearSession();
  window.location.href = "./";
}
util.method = {
  changeSelfPassword(oldPassword, newPasssword, username, okCb, errCb) {
    util.getJsonPost(urls.CHANGE_SELF_PASSWORD, okCb, errCb, {
      oldPassword: oldPassword,
      newPassword: newPasssword,
      username: username
    });
  },
  getDataCount(table, okCb, errCb) {
    util.getJsonPost(urls.GET_COUNT, okCb, errCb, {
      table: table
    });
  },
  addUser(username, password, okCb, errCb) {
    util.getJsonPost(urls.SIGNUP, okCb, errCb, {
      username: username,
      password: password,
      okCb,
      errCb
    });
  },
  updateData(table, key, data, okCb, errCb) {
    util.getJsonPost(urls.UPDATE_DATA, okCb, errCb, {
      table: table,
      key: key,
      data: data
    })
  },
  addData(table, key, data, okCb, errCb) {
    util.getJsonPost(urls.INSERT_DATA, okCb, errCb, {
      table: table,
      key: key,
      data: data
    })
  },
  getData(table, where, isQuery,okCb, errCb) {
    util.getJsonPost(urls.GET_DATA, okCb, errCb, {
      table: table,
      where: where,
      isQuery:isQuery
    })
  },
  saveLog(action,msg){
    let userinfo = util.getObjSession("userinfo")
    let username = userinfo.username;
    let nickname = userinfo.nickname;
    util.method.addData("logs",null,{
      username:username,
      nickname:nickname,
      action:action,
      msg:msg
    });
  },
  logDel(msg){
    util.method.saveLog("删除",msg);
  },
  logAdd(msg){
    util.method.saveLog("新增",msg);
  },
  logEdit(msg){
    util.method.saveLog("编辑",msg);
  }
};

export default util;
