import axiosRequest from "@utils/axiosRequest";
import moment from "moment";
import eventBus from "@baidumap/base/EventBus";
import userArray from "@baidumap/assets/mock/djbgUser";




//内存中存放的静态数据
let storageUsers = null;
//已经处理好在线状态的缓存数据
let stateGroups = null;


/**
 * 从缓存中获取用户信息
 * 
 * 如果内存中的用户信息没有初始化，那么会从本地缓存中获取，
 * 如果本地缓存没有初始化，则读取静态数据
 */
let getStorageUsers = () => {
    if (storageUsers) {
        return storageUsers;
    }

    let json = window.localStorage.getItem("protect_users");
    if (json) {
        storageUsers = JSON.parse(json);
    } else {
        storageUsers = userArray;
    }

    return storageUsers;
};

/**
 * 设置本地缓存中的用户信息（完整替换）
 * 
 * 在设置缓存的时候会同步刷新内存中的用户信息
 * @param {*} users 
 */
let setStorageUsers = (users) => {
    try {
        let json = JSON.stringify(users);
        if (json) {
            window.localStorage.setItem("protect_users");
        }

        storageUsers = users;
    } catch (error) {
        console.error(error);
    }
};


/**
 * 从缓存的用户中找到排班的用户
 */
let findCurrentUsers = () => {
    let users = getStorageUsers();
    let m = moment();

    return users.filter((user) => {
        let startDate = moment(user.kssj, "YYYY-MM-DD HH:mm:ss");
        let endDate = moment(user.jssj, "YYYY-MM-DD HH:mm:ss");

        return m.isBetween(startDate, endDate);
    });
};


/**
 * 创建保电班组信息
 * @param {*} users 
 */
let makeGroup = (users) => {
    let map = {};
    users.forEach((user) => {
        let key = user.full_name + "_" + user.kssj + "_" + user.jssj;
        let group = null;
        if (!map[key]) {
            group = {
                attr: Object.assign({
                    online: false,
                    noticeDate: null,
                    notice: false
                }, user),
                users: []
            };
            delete group.attr.user_id;
            delete group.attr.fzr;
            map[key] = group;
        }else{
            group = map[key];
        }

        group.users.push({
            id: user.user_id,
            name: user.fzr,
            online: false,
            noticeDate: null,
            found: false
        });
    });

    let keys = Object.keys(map);
    return keys.map((key) => {
        return map[key];
    });
};

/**
 * 创建人员的Map映射关系
 */
let makeUserMap = (groups) => {
    let userMap = {};

    groups.forEach(group => {
        group.users.forEach(user => {
            userMap[user.id] = user;
        });
    });

    return userMap;
};

/**
 * 判断一种岗位角色的人员上线状态
 */
let changeOneTypeUserHasOnline = (userMap, resUserArray, fun) => {

    resUserArray.forEach(item => {
        let id = fun(item);
        if (!id) {
            return;
        }

        let user = userMap[id];
        if (!user) {
            return;
        }

        user.found = true;
        if (user.online) {
            return;
        }

        user.online = true;
        user.noticeDate = new Date();
    });
};

/**
 * 判断人员与上一次的在线状态是否一致，不一致需要通知
 */
let changeUserNotice = (userMap, stateUsers) => {
    stateUsers.forEach(item => {
        let id = item.id;
        let user = userMap[id];

        //如果新上线，使用新的通知时间，否则使用老的通知时间
        if(user){
            user.found = true;
            if (user.online !== item.online) {
                user.notice = true;
            }else{
                user.noticeDate = item.noticeDate;
            }
        }
    });

    stateUsers.forEach(item=>{
        if(!item.found && item.online){
            item.notice = true;
        }
    });
};


let changeGorupNotice = (currentGroup , stateGroups) =>{
    let map = {};
    currentGroup.forEach(group=>{
        map[group.attr.full_name] = group;
    });

    stateGroups.forEach(group=>{
        let currentGroup = map[group.attr.full_name];
        if(currentGroup){
            currentGroup.attr.found = true;
            if(currentGroup.attr.online !== group.attr.online){
                currentGroup.attr.notice = true;
            }   
        }
    });

    currentGroup.forEach(group=>{
        if(!group.attr.found){
            group.attr.notice = true;
        }
    });
};


/**
 * 判断现场管控人员是否在线
 */
let onlinePersonIsOnline = (item) => {
    if (item && item.realtime_point && item.realtime_point.location && item.realtime_point.location.length > 0) {
        return item.entity_name;
    }

    return null;
};

/**
 * 判断施工人员是否在线
 */
let workPersonIsOnline = (item) => {
    if (item && item.longitude && item.latitude) {
        return item.userName;
    }

    return null;
};


/**
 * 判断所有人员的上线状态
 * 
 * @param {*} userMap 
 * @param {*} responses 
 */
let changeUserHasOnline = (userMap , responses)=>{
    responses.forEach(response => {
        if (0 !== parseInt(response.type)) {
            return;
        }

        var data = response.data;
        if (!data) {
            return;
        }

        if (Array.isArray(data)) {
            changeOneTypeUserHasOnline(userMap, data, onlinePersonIsOnline);
        } else {
            data = data.list;
            if (!data) {
                return;
            }
            changeOneTypeUserHasOnline(userMap, data, workPersonIsOnline);
        }
    });
};

let changeGroupsHasOnline = (userMap , groups)=>{
    groups.forEach((group)=>{
        let onlineUsers = group.users.filter(user=>{
            let mapedUser = userMap[user.id];
            user.online = mapedUser.online;
            user.noticeDate = mapedUser.noticeDate;
            user.notice = mapedUser.notice;

            return user.online;
        });

        if(onlineUsers.length === 0){
            group.attr.online = false;
        }else{
            group.attr.online = true;
            group.attr.noticeDate = onlineUsers.sort((a,b)=>{
                return a.noticeDate.getTime() - b.noticeDate.getTime();
            })[0];
        }
    });
};


/**
 * 从以判断在线状态的组缓存中提取用户
 */
let extractingOnlineUsers = ()=>{
    if(!stateGroups){
        return [];
    }

    let users = [];
    stateGroups.forEach((group)=>{
        group.users.forEach((user)=>{
            users.push(user);
        });
    });

    return users;
};


let makeResult = (groups)=>{
    let users = groups.map(group =>{
        let user = null;
        if(group.attr.online){
            let users = group.users.filter(user=>{
                return user.online;
            });    
            user = users[0];
        }else{
            user = group.users[0];
        }

        return {
            id : user.id,
            name : user.name,
            full_name : group.attr.full_name,
            fzr : group.attr.fzr,
            fzsb : group.attr.fzsb,
            dwmc : group.attr.hasOwnProperty("dwmc") ? group.attr.dwmc : "", 
            zyfl : group.attr.zyfl,
            lxfs : group.attr.lxfs,
            zshxsbz : group.attr.zshxsbz,
            ryly : group.attr.ryly,
            zgrq : group.attr.zgrq,
            zgsj : group.attr.zgsj,
            kssj : group.attr.kssj,
            jssj : group.attr.jssj,
            online : group.attr.online,
            notice : group.attr.notice,
            noticeDate : group.attr.noticeDate
        };
    });

    let onlineArr = users.filter(user=>{
        return user.online;
    });

    let offlineArr = users.filter(user =>{
        return !user.online;
    });

    let noticeOnlineArr = users.filter(user=>{
        return user.online && user.notice;
    });

    let noticeOfflineArr = users.filter(user =>{
        return !user.online && user.notice;
    });

    return {
        users : users,
        count : users.length,

        onlineUsers : onlineArr,
        onlineUserCount : onlineArr.length,

        offlineUsers : offlineArr,
        offlineUserCount : offlineArr.length,

        noticeOnlineUsers : noticeOnlineArr,
        noticeOnlineUserCount : noticeOnlineArr.length,

        noticeOfflineUsers : noticeOfflineArr,
        noticeOfflineUserCount : noticeOfflineArr.length
    };
};

// let makeUserStateArray = (users, responses) => {
//     let copyed = copyUserArray(userArray);

//     responses.forEach(response => {
//         if (0 !== parseInt(response.type)) {
//             return;
//         }

//         var data = response.data;
//         if (!data) {
//             return;
//         }

//         if (Array.isArray(data)) {
//             changeUserHasOnline(copyed, data, onlinePersonIsOnline);
//         } else {
//             data = data.list;
//             if (!data) {
//                 return;
//             }
//             changeUserHasOnline(copyed, data, workPersonIsOnline);
//         }
//     });

//     changeUserNotice(copyed, users);

//     let currentOnlineCount = 0;
//     let currentOfflineCount = 0;
//     let onlineArr = [];
//     let offlineArr = [];
//     let noticeOnlineArr = [];
//     let noticeOfflineArr = [];
//     copyed.forEach(user => {
//         if (user.online) {
//             onlineArr.push(user);
//         } else {
//             offlineArr.push(user);
//         }

//         if (user.notice) {
//             if (user.online) {
//                 noticeOnlineArr.push(user)
//                 currentOnlineCount++;
//             } else {
//                 noticeOfflineArr.push(user);
//                 currentOfflineCount++;
//             }
//         }
//     });

//     return {
//         users: copyed, //当前人员状态

//         onlineUserCount: onlineArr.length,
//         onlineUsers: onlineArr,

//         offlineUserCount: offlineArr.length,
//         offlineUsers: offlineArr,

//         noticeOnlineUsers: noticeOnlineArr, //当前上线人员
//         noticeOnlineCount: noticeOnlineArr.length, //当前上线的人数

//         noticeOfflineUsers: noticeOfflineArr, //当前下线人员
//         noticeOfflineCount: noticeOfflineArr.length //当前下线的人数
//     };
// };


let updateStateUsers = (responses) =>{
    let currentUsers = findCurrentUsers();
    let currentGroups = makeGroup(currentUsers);
    let currentUserMap = makeUserMap(currentGroups);

    let stateUsers = extractingOnlineUsers();

    changeUserHasOnline(currentUserMap ,responses);
    changeUserNotice(currentUserMap , stateUsers);

    changeGroupsHasOnline(currentUserMap , currentGroups);
    changeGorupNotice(currentGroups , stateGroups);

    stateGroups = currentGroups;

    return makeResult(currentGroups);
};

/**
 * 从接口中刷新人员在线状态
 */
let loadUserInfo = () => {
    return new Promise((resolve , reject)=>{
        Promise.all([
            axiosRequest('/pdaqfh_Web_exploded/f/wgyw/getOnlinePeopleLocations?limit=-1', '获取当前人员统计信息'),
            axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=wkresponser&status=-1&limit=-1&offset=0', '施工队伍明细-工作负责人'),
            axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=wkapprover&status=-1&limit=-1&offset=0', '施工队伍明细-工作许可人'),
            axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=manage&status=-1&limit=-1&offset=0', '施工队伍明细-管理人'),
            axiosRequest('/pdaqfh_Web_exploded/f/sggk/getCurConstructorList?personType=supervisor&status=-1&limit=-1&offset=0', '施工队伍明细-查岗人员')
        ]).then((responses) => {
            let result = updateStateUsers(responses);
            eventBus.emit("app.bzrw.user.refresh", result);
    
            resolve( result );
        }).catch((error) => {
            console.error(error);
    
            reject(error);
        });
    });
};

let cachedUserTimer = null;

stateGroups = makeGroup(findCurrentUsers());
loadUserInfo().then((response)=>{
    // eventBus.emit("app.bzrw.user.init" , response);
    cachedUserTimer = setInterval(() => {
        loadUserInfo();
    }, 1000 * 60 * 1);
}).catch(error=>{
    cachedUserTimer = setInterval(() => {
        loadUserInfo();
    }, 1000 * 60 * 1);
});


export default ()=>{
    return makeResult(stateGroups || []);
};

