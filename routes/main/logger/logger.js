var winston = require('winston');
var config = require('./Config');
var _logDir = config.serverConfig.log_dir;

var Logger = function () {
};

Logger.GetTwoDigitStr = function (n) {
    var str = '' + n;
    if (n < 10) str = '0' + str
    return str;
}

/***
* 로그 파일 이름
*/
Logger.GetLogFileName = function () {
    var time = new Date();
    var year = time.getFullYear();
    var month = Logger.GetTwoDigitStr(time.getMonth() + 1);
    var day = Logger.GetTwoDigitStr(time.getDate());
    var hour = Logger.GetTwoDigitStr(time.getHours());

    var fileName = _logDir + 'server_log_' + year + '_' + month + '_' + day + '_' + hour;
    return fileName;
};


/***
* 예외 로그 파일 이름
*/
Logger.GetExceptionLogFileName = function () {
    var time = new Date();
    var year = time.getFullYear();
    var month = Logger.GetTwoDigitStr(time.getMonth() + 1);
    var day = Logger.GetTwoDigitStr(time.getDate());
    var hour = Logger.GetTwoDigitStr(time.getHours());

    var fileName = _logDir + 'server_execption_log_' + year + '_' + month + '_' + day + '_' + hour;
    return fileName;
};

Logger._logFileName = Logger.GetLogFileName();
Logger._exceptionFileName = Logger.GetExceptionLogFileName();
Logger._logConsole = new (winston.transports.Console)({ level: 'debug' });
Logger._logFile = new (winston.transports.File)({
    filename: Logger._logFileName, level: 'debug', timestamp: function () {
        var time = new Date();
        var year = time.getFullYear();
        var month = Logger.GetTwoDigitStr(time.getMonth() + 1);
        var day = Logger.GetTwoDigitStr(time.getDate());
        var hour = Logger.GetTwoDigitStr(time.getHours());
        var min = Logger.GetTwoDigitStr(time.getMinutes());
        var sec = Logger.GetTwoDigitStr(time.getSeconds());
        var mill = Logger.GetTwoDigitStr(time.getMilliseconds());

        if (mill < 10) mill = '00' + mill
        else if (mill < 100) mill = '0' + mill;

        return year + '_' + month + '_' + day + '_' + hour + '_' + min + '_' + sec + '_' + mill + 'Z';
    }
});

Logger._exceptionFile = new (winston.transports.File)({
    filename: Logger._exceptionFileName, level: 'debug', timestamp: function () {
        var time = new Date();
        var year = time.getFullYear();
        var month = Logger.GetTwoDigitStr(time.getMonth() + 1);
        var day = Logger.GetTwoDigitStr(time.getDate());
        var hour = Logger.GetTwoDigitStr(time.getHours());
        var min = Logger.GetTwoDigitStr(time.getMinutes());
        var sec = Logger.GetTwoDigitStr(time.getSeconds());
        var mill = Logger.GetTwoDigitStr(time.getMilliseconds());

        if (mill < 10) mill = '00' + mill
        else if (mill < 100) mill = '0' + mill;

        return year + '_' + month + '_' + day + '_' + hour + '_' + min + '_' + sec + '_' + mill + 'Z';
    }
});

Logger._logger = new (winston.Logger)({
    exitOnError: true,
    level: 'debug',
    transports: [
		Logger._logConsole,
		Logger._logFile
    ],

    exceptionHandlers: [
		Logger._logConsole,
		Logger._exceptionFile
    ]
});

Logger._logger.setLevels(winston.config.syslog.levels);

Logger.info = function (message) {
    Logger._logger.info(message);
};

Logger.emerg = function (message) {
    Logger._logger.error(message);
};

Logger.log = function (message) {
    Logger._logger.info("[S][][LOG]" + message);
};

module.exports = Logger;