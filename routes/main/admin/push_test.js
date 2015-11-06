var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var gcm = require('node-gcm');
var router = express.Router();

// create a message with default values
var message = new gcm.Message();

// or with object values
var message = new gcm.Message({
    collapseKey: 'demo',
    delayWhileIdle: true,
    timeToLive: 3,
    data: {
        title : "이기섭입니다.",
        description : "이기섭이 만든 description",
        image_flag : "1",
        url : "market://details?id=com.bulb.alchemy",
        param1 : "hoho",
        param2 : "haha"
    }
});

var server_access_key = 'AIzaSyBJ2X4eC4i66kTHHG8ymmC3Ffq_KDCk5kM';
var sender = new gcm.Sender(server_access_key);
var registrationIds = [];

var registration_id = 'fVsyqK8-B1o:APA91bGdTZGbFtOulSGwk35iMll4C6AhCwjVWJ8MU_pfX2xBQa4K_56FFE8GoeNDD7Lj1NGyNnI9tWUslvVnAdkz2Hn9M1pR9I4C-rUokUjlXI1XpQOknpfPxbsmU0T27C_VcyCWbx2N';
// At least one required
registrationIds.push(registration_id);

/**
 * Params: message-literal, registrationIds-array, No. of retries, callback-function
 **/
sender.send(message, registrationIds, 4, function (err, result) {
    console.log(result);
});

module.exports = router;