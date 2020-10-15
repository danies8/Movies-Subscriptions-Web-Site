let moment = require('moment');

exports.isNumeric = (num) => {
    return !isNaN(num)
}

exports.isValidImageURL = (url) => {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

exports.validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

exports.getNextArrayId = (arr) => {
    let maxUserId = arr.map(item => item.id).sort((a, b) => a - b)[
        arr.length - 1
    ]
    if(maxUserId == undefined){
        return 1;
    }

    return maxUserId + 1;
}

exports.isValidDate = (str) => {
    const splitedStr = str.split('-');
    const year = splitedStr[0];
    const month = splitedStr[1];
    const day = splitedStr[2];
    
    if (!isNumeric(year)) {
        return false;
    }
    if (!isNumeric(month) || !(parseInt(month) >=1 && parseInt(month) <=12)) {
        return false;
    }
    if (!isNumeric(day) || !(parseInt(day) >=1 && parseInt(day) <=31)) {
        return false;
    }

    var d = moment(str, 'YYYY-MM-DD');
    if (d == null || !d.isValid()) return false;
    return str.indexOf(d.format('YYYY-MM-DD')) >= 0
}

 const isNumeric = (num) => {
    return !isNaN(num)
}

exports.menuColor = "cornflowerblue";

// All paths in app
exports.login = "/";
exports.createAccount = "/createAccount";
exports.mainPage = "/mainPage";

exports.welcomePage = "/mainPage/welcomePage";
exports.movieManagement = "/mainPage/movieManagement";
exports.subscriptionManagement = "/mainPage/subscriptionManagement";
exports.userManagement = "/mainPage/userManagement";

exports.allMembers = "/mainPage/subscriptionManagement/allMembers";
exports.allMembersWithId = "/mainPage/subscriptionManagement/allMembers/:memberId";
exports.addMember = "/mainPage/subscriptionManagement/addMember";
exports.editMember = "/mainPage/subscriptionManagement/allMembers/editMember/:memberId";
exports.editMemberWithId = "/mainPage/subscriptionManagement/allMembers/editMember";

exports.allMovies= "/mainPage/movieManagement/allMovies";
exports.addMovie= "/mainPage/movieManagement/addMovie";
exports.editMovie= "/mainPage/movieManagement/allMovies/editMovie/:movieId";
exports.movieName= "/mainPage/movieManagement/allMovies/:movieName";
exports.editMovieWithId = "/mainPage/movieManagement/allMovies/editMovie";

exports.allUsers="/mainPage/userManagement/allUsers";
exports.addUser="/mainPage/userManagement/addUser";
exports.editUser="/mainPage/userManagement/allUsers/editUser/:userId";
exports.editUserWithId="/mainPage/userManagement/allUsers/editUser";

exports.reload = "/reload";

exports.adminUserName="yael_b4@yahoo.com";