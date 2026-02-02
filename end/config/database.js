import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database', 'blog.db');

// 创建数据库连接
export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('✅ 数据库连接成功');
  }
});

// 初始化数据库表
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    // 用户表
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
        user_head TEXT DEFAULT 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
        user_power_id INTEGER DEFAULT 1,
        qq_id TEXT,
        qq_name TEXT,
        qq_img TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 文章表
    const createArticlesTable = `
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        labels TEXT, -- JSON格式存储标签数组
        user_id TEXT NOT NULL,
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        status INTEGER DEFAULT 1, -- 1: 发布, 0: 草稿
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    // 日记表
    const createDiariesTable = `
      CREATE TABLE IF NOT EXISTS diaries (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `;

    // 留言表
    const createGuestbookTable = `
      CREATE TABLE IF NOT EXISTS guestbook (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        parent_id TEXT DEFAULT NULL, -- 回复的留言ID
        user_id TEXT NOT NULL,
        address TEXT DEFAULT '未知',
        likes INTEGER DEFAULT 0,
        content_img TEXT, -- 图片URL，逗号分隔
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (parent_id) REFERENCES guestbook (id)
      )
    `;

    // 评论表（文章评论）
    const createCommentsTable = `
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        article_id TEXT NOT NULL,
        content TEXT NOT NULL,
        parent_id TEXT DEFAULT NULL,
        user_id TEXT NOT NULL,
        address TEXT DEFAULT '未知',
        likes INTEGER DEFAULT 0,
        content_img TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (article_id) REFERENCES articles (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (parent_id) REFERENCES comments (id)
      )
    `;

    const tables = [
      createUsersTable,
      createArticlesTable,
      createDiariesTable,
      createGuestbookTable,
      createCommentsTable
    ];

    let completed = 0;
    
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          console.error(`创建表 ${index + 1} 失败:`, err.message);
          reject(err);
        } else {
          completed++;
          console.log(`✅ 表 ${index + 1} 创建成功`);
          
          if (completed === tables.length) {
            // 插入默认管理员用户
            const defaultUser = {
              id: 'apple1704348343094',
              username: 'admin',
              email: 'admin@example.com',
              password: '$2a$10$nFgr38pAxE1DyA5jojlf7.uY1tvMewegyZ/d/QQyD2k3YhKaaZk.W', // 密码: admin123
              user_head: 'https://img.zhangpingguo.com/AppleBlog/logo/logo.jpg',
              user_power_id: 999
            };

            const insertUserSql = `
              INSERT OR IGNORE INTO users (id, username, email, password, user_head, user_power_id)
              VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.run(insertUserSql, [
              defaultUser.id,
              defaultUser.username,
              defaultUser.email,
              defaultUser.password,
              defaultUser.user_head,
              defaultUser.user_power_id
            ], (err) => {
              if (err) {
                console.error('插入默认用户失败:', err.message);
              } else {
                console.log('✅ 默认用户创建成功 (用户名: admin, 密码: admin123)');
              }
              resolve();
            });
          }
        }
      });
    });
  });
};