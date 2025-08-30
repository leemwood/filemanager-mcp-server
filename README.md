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

- "创建一个新的配置文件 config.json"
- "复制 README.md 到 docs 文件夹"
- "搜索所有的 JavaScript 文件"
- "批量删除所有临时文件"

## 功能特性

### 基础文件操作
- **create_file** - 创建新文件
- **read_file** - 读取文件内容
- **write_file** - 写入文件内容
- **delete_file** - 删除文件或文件夹
- **copy_file** - 复制文件或文件夹
- **move_file** - 移动或重命名文件
- **get_file_info** - 获取文件详细信息

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

## 许可证

ISC

---

**GitHub**: [filemanager-mcp-server](https://github.com/ning-g-mo/filemanager-mcp-server)