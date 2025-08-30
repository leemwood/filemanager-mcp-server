# File Manager MCP Server

一个功能强大的文件管理 MCP 服务器，提供完整的文件和目录操作功能。

## 快速开始

### 安装

#### 全局安装（推荐）

```bash
npm install -g filemanager-mcp-server
```

#### 项目内安装

```bash
npm install filemanager-mcp-server
```

### 配置 MCP 服务

在 Trae IDE 的 MCP 配置中添加：


```json
{
  "mcpServers": {
    "filemanager": {
      "command": "npx",
      "args": [
        "-y",
        "filemanager-mcp-server"
      ]
    }
  }
}
```

#### 手动指定路径（如果上述方法不工作）

克隆仓库

```bash
git clone https://github.com/yourusername/filemanager-mcp-server.git
```

进入项目目录

```bash
cd filemanager-mcp-server
```

安装依赖

```bash
npm install
```

```json
{
  "mcpServers": {
    "filemanager": {
      "command": "node",
      "args": ["node_modules/filemanager-mcp-server/index.js"]
    }
  }
}
```

### 使用示例

配置完成后，您可以在 Trae IDE 中使用自然语言进行文件管理：

#### 基础操作
- "创建一个新的配置文件 config.json"
- "复制 README.md 到 docs 文件夹"
- "搜索所有的 JavaScript 文件"
- "批量删除所有临时文件"

#### 增强功能 ✨
- "使用 Node.js 模板创建一个新的应用文件"
- "在文件末尾追加日志信息，并创建备份"
- "创建一个完整的 React 项目结构"
- "只读取文件的第 10-20 行内容"
- "使用自定义变量从 HTML 模板创建页面"
- "以 append 模式编辑配置文件，不覆盖现有内容"

## 功能特性

### 基础文件操作
- **create_file** - 创建新文件
- **read_file** - 读取文件内容
- **write_file** - 写入文件内容
- **delete_file** - 删除文件或文件夹
- **copy_file** - 复制文件或文件夹
- **move_file** - 移动或重命名文件
- **get_file_info** - 获取文件详细信息

### 增强文件操作 ✨
- **edit_file_advanced** - 高级文件编辑（支持多种编辑模式、自动备份、编码选择）
- **read_file_advanced** - 高级文件读取（支持按行读取、按字节读取、编码选择）
- **create_from_template** - 从模板创建文件（支持变量替换）
- **create_project_structure** - 创建项目目录结构（支持预定义和自定义结构）

### 目录操作
- **list_directory** - 列出目录内容
- **create_directory** - 创建新目录
- **search_files** - 搜索文件（支持通配符）

### 批量操作
- **batch_read_files** - 批量读取多个文件
- **batch_copy_files** - 批量复制文件
- **batch_move_files** - 批量移动文件
- **batch_delete_files** - 批量删除文件
- **batch_create_files** - 批量创建文件

## API 参考

### 基础操作

#### 创建文件
```json
{
  "name": "create_file",
  "arguments": {
    "path": "config.json",
    "content": "{\"name\": \"example\"}"
  }
}
```

#### 读取文件
```json
{
  "name": "read_file",
  "arguments": {
    "path": "config.json"
  }
}
```

#### 搜索文件
```json
{
  "name": "search_files",
  "arguments": {
    "directory": "./src",
    "pattern": "*.js",
    "recursive": true
  }
}
```

### 批量操作

#### 批量创建文件
```json
{
  "name": "batch_create_files",
  "arguments": {
    "files": [
      {"path": "file1.txt", "content": "Content 1"},
      {"path": "file2.txt", "content": "Content 2"}
    ]
  }
}
```

#### 批量复制文件
```json
{
  "name": "batch_copy_files",
  "arguments": {
    "sources": ["src/file1.js", "src/file2.js"],
    "destination": "./backup",
    "preserve_structure": false
  }
}
```

### 增强功能 API

#### 高级文件编辑
```json
{
  "name": "edit_file_advanced",
  "arguments": {
    "path": "config.json",
    "content": "新的配置内容",
    "encoding": "utf8",
    "backup": true,
    "mode": "overwrite"
  }
}
```

支持的编辑模式：
- `overwrite` - 覆盖整个文件
- `append` - 追加到文件末尾
- `prepend` - 插入到文件开头
- `insert` - 在指定位置插入（需要 `position` 参数）

#### 从模板创建文件
```json
{
  "name": "create_from_template",
  "arguments": {
    "template": "nodejs",
    "path": "./my-app.js",
    "variables": {
      "AUTHOR": "Your Name",
      "PROJECT_NAME": "My Project",
      "VERSION": "1.0.0"
    }
  }
}
```

可用模板：
- `html5` - HTML5 页面模板
- `nodejs` - Node.js 应用模板
- `python` - Python 脚本模板
- `react-component` - React 组件模板
- `styles` - CSS 样式模板
- `readme` - README 文档模板

#### 创建项目结构
```json
{
  "name": "create_project_structure",
  "arguments": {
    "basePath": "./my-project",
    "template": "react"
  }
}
```

预定义项目结构：
- `nodejs` - Node.js 项目结构
- `react` - React 应用结构
- `python` - Python 项目结构
- `express` - Express.js 应用结构

#### 高级文件读取
```json
{
  "name": "read_file_advanced",
  "arguments": {
    "path": "large-file.txt",
    "encoding": "utf8",
    "lines": {
      "start": 10,
      "end": 20
    }
  }
}
```

## 测试

运行功能测试：

```bash
node example-usage.js
```

## 技术栈

- **Node.js** - 运行时环境
- **@modelcontextprotocol/sdk** - MCP SDK
- **fs-extra** - 文件系统操作
- **path** - 路径处理

## 注意事项

- 所有路径会被解析为绝对路径
- 创建文件时会自动创建必要的父目录
- 删除操作不可逆，请谨慎使用
- 支持 UTF-8 编码的文本文件
- 搜索功能支持通配符模式（* 匹配任意字符）


---

**GitHub**: [filemanager-mcp-server](https://github.com/leemwood/filemanager-mcp-server)