const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

// 创建 logs 目录（如果不存在）
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 自定义日志格式
const logFormat = printf(({ level, message, timestamp, pid }) => {
  return `${timestamp} [${level.toUpperCase()}] [PID:${pid}]: ${message}`;
});

// 按天创建子目录的 Transport
const createDailyRotateTransport = (level) => {
  return new DailyRotateFile({
    level: level,
    filename: path.join(logDir, '%DATE%', `${level}.log`), // 每天一个文件夹，文件按级别命名
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // 自动压缩旧日志
    maxSize: '20m',      // 单个文件最大 20MB
    maxFiles: '30d',     // 保留最近 30 天的日志
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    )
  });
};

// 创建 Logger 实例
const logger = winston.createLogger({
  levels: {
    error: 0,
    warning: 1,
    info: 2
  },
  transports: [
    // 控制台输出（带颜色）
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    // 按级别分文件存储
    createDailyRotateTransport('info'),
    createDailyRotateTransport('warning'),
    createDailyRotateTransport('error')
  ],
  defaultMeta: { pid: process.pid } // 添加进程 ID
});

module.exports = logger;