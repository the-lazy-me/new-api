-- 创建数据库
CREATE DATABASE IF NOT EXISTS `new-api`;
CREATE DATABASE IF NOT EXISTS `new-api-logs`;

-- 修改 root 用户权限
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;