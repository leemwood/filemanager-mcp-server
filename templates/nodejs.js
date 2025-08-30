#!/usr/bin/env node

/**
 * {{title}}
 * {{description}}
 * 
 * @author {{author}}
 * @version {{version}}
 * @created {{date}}
 */

'use strict';

// 导入必要的模块
const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');

// 配置常量
const CONFIG = {
    // 在这里添加配置项
    debug: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
};

/**
 * 主类
 */
class {{className}} {
    constructor(options = {}) {
        this.options = { ...CONFIG, ...options };
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        if (this.options.debug) {
            console.log('初始化 {{className}}...');
        }
    }
    
    /**
     * 启动应用
     */
    async start() {
        try {
            console.log(`{{className}} 启动成功`);
            console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
            
            // 在这里添加启动逻辑
            
        } catch (error) {
            console.error('启动失败:', error);
            process.exit(1);
        }
    }
    
    /**
     * 停止应用
     */
    async stop() {
        try {
            console.log('正在停止 {{className}}...');
            
            // 在这里添加清理逻辑
            
            console.log('{{className}} 已停止');
        } catch (error) {
            console.error('停止时发生错误:', error);
        }
    }
    
    /**
     * 示例异步方法
     */
    async processData(data) {
        try {
            // 处理数据的逻辑
            return data;
        } catch (error) {
            throw new Error(`数据处理失败: ${error.message}`);
        }
    }
    
    /**
     * 示例文件操作方法
     */
    async readFile(filePath) {
        try {
            const absolutePath = path.resolve(filePath);
            const content = await fs.readFile(absolutePath, 'utf8');
            return content;
        } catch (error) {
            throw new Error(`读取文件失败: ${error.message}`);
        }
    }
    
    /**
     * 示例文件写入方法
     */
    async writeFile(filePath, content) {
        try {
            const absolutePath = path.resolve(filePath);
            await fs.writeFile(absolutePath, content, 'utf8');
            return absolutePath;
        } catch (error) {
            throw new Error(`写入文件失败: ${error.message}`);
        }
    }
}

/**
 * 工具函数
 */
const utils = {
    /**
     * 格式化日期
     */
    formatDate(date = new Date()) {
        return date.toISOString().split('T')[0];
    },
    
    /**
     * 延迟执行
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * 验证邮箱格式
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * 生成随机字符串
     */
    generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};

/**
 * 错误处理
 */
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
    process.exit(1);
});

// 优雅退出
process.on('SIGINT', async () => {
    console.log('\n收到SIGINT信号，正在优雅退出...');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('收到SIGTERM信号，正在优雅退出...');
    process.exit(0);
});

// 导出
module.exports = {
    {{className}},
    utils,
    CONFIG
};

// 如果直接运行此文件
if (require.main === module) {
    const app = new {{className}}();
    app.start().catch(console.error);
}