# FileManager MCP 服务

这是一个基于 Model Context Protocol (MCP) 的 Windows 文件管理器服务，提供与 Windows 文件管理器类似的基础文件管理功能。通过自然语言即可在 Trae IDE 中进行文件和目录操作。

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 测试服务
```bash
node test.js
```

### 3. 在 Trae IDE 中配置
在 Trae IDE 的 MCP 设置中添加此服务，然后就可以使用自然语言进行文件管理了！

**示例使用**：
- "请创建一个新的配置文件 config.json"
- "帮我复制 README.md 到 docs 文件夹"
- "搜索所有的 JavaScript 文件"

## 功能特性

### 文件操作
- **创建文件** (`create_file`) - 创建新文件，可选择性添加初始内容
- **删除文件** (`delete_file`) - 删除文件或文件夹
- **读取文件** (`read_file`) - 读取文件内容
- **写入文件** (`write_file`) - 写入或编辑文件内容
- **复制文件** (`copy_file`) - 复制文件或文件夹到指定位置
- **移动文件** (`move_file`) - 移动或重命名文件/文件夹（剪切功能）

### 目录操作
- **创建目录** (`create_directory`) - 创建新目录
- **列出目录** (`list_directory`) - 列出目录内容，支持详细信息显示

### 信息查询
- **文件属性** (`get_file_info`) - 获取文件或文件夹的详细属性信息
- **文件搜索** (`search_files`) - 在指定目录中搜索文件，支持通配符模式

## 安装

1. 克隆或下载此项目
2. 安装依赖：
```bash
npm install
```

## 使用方法

### 方法一：在 Trae IDE 中使用（推荐）

#### 1. 配置 MCP 服务

在 Trae IDE 中配置 FileManager MCP 服务：

1. 打开 Trae IDE 设置
2. 找到 "MCP" 或 "模型上下文协议" 设置
3. 选择 "手动添加 MCP Server"
4. 填写配置信息：
   - **名称**: `filemanager`
   - **命令**: `node`
   - **参数**: `["E:\\projects\\filemanager\\index.js"]`（请替换为您的实际路径）
   - **工作目录**: `E:\\projects\\filemanager`（请替换为您的实际路径）

或者使用配置文件方式，在 Trae 的 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "filemanager": {
      "command": "node",
      "args": ["E:\\projects\\filemanager\\index.js"],
      "cwd": "E:\\projects\\filemanager"
    }
  }
}
```

#### 2. 在 Trae IDE 中使用

配置完成后，您可以在 Trae IDE 的 AI 对话中直接使用自然语言来管理文件：

**创建文件示例**：
- "请创建一个名为 config.json 的文件"
- "帮我创建一个包含 Hello World 的 test.txt 文件"

**文件操作示例**：
- "请将 test.txt 复制到 backup 文件夹"
- "帮我删除临时文件 temp.log"
- "请读取 config.json 的内容"

**目录操作示例**：
- "请创建一个名为 assets 的目录"
- "列出当前目录的所有文件"
- "显示 src 目录的详细信息"

**搜索文件示例**：
- "搜索所有 .js 文件"
- "在项目中查找所有 README 文件"

### 方法二：直接运行（开发测试）

#### 直接运行
```bash
node index.js
```

#### 使用 npm 脚本
```bash
npm start
```

#### 功能测试
```bash
node test.js
```

## 工具详细说明

### 基础文件操作

#### 1. create_file
创建新文件
- **参数**：
  - `path` (必需): 文件路径
  - `content` (可选): 文件内容，默认为空字符串

#### 2. delete_file
删除文件或文件夹
- **参数**：
  - `path` (必需): 要删除的文件或文件夹路径

#### 3. read_file
读取文件内容
- **参数**：
  - `path` (必需): 文件路径

#### 4. write_file
写入或编辑文件内容
- **参数**：
  - `path` (必需): 文件路径
  - `content` (必需): 要写入的内容

#### 5. copy_file
复制文件或文件夹
- **参数**：
  - `source` (必需): 源文件或文件夹路径
  - `destination` (必需): 目标路径

#### 6. move_file
移动或重命名文件/文件夹（剪切功能）
- **参数**：
  - `source` (必需): 源文件或文件夹路径
  - `destination` (必需): 目标路径

#### 7. get_file_info
获取文件或文件夹属性信息
- **参数**：
  - `path` (必需): 文件或文件夹路径

### 目录操作

#### 8. list_directory
列出目录内容
- **参数**：
  - `path` (必需): 目录路径
  - `detailed` (可选): 是否显示详细信息（大小、修改时间等），默认为 false

#### 9. create_directory
创建目录
- **参数**：
  - `path` (必需): 目录路径

### 搜索功能

#### 10. search_files
搜索文件
- **参数**：
  - `directory` (必需): 搜索目录
  - `pattern` (必需): 搜索模式（文件名模式，支持通配符 *）
  - `recursive` (可选): 是否递归搜索子目录，默认为 true

### 批量操作功能 🆕

#### 11. batch_read_files
批量读取多个文件内容
- **参数**：
  - `paths` (必需): 文件路径数组

#### 12. batch_copy_files
批量复制文件到指定目录
- **参数**：
  - `sources` (必需): 源文件路径数组
  - `destination` (必需): 目标目录路径

#### 13. batch_move_files
批量移动文件到指定目录
- **参数**：
  - `sources` (必需): 源文件路径数组
  - `destination` (必需): 目标目录路径

#### 14. batch_delete_files
批量删除文件或文件夹
- **参数**：
  - `paths` (必需): 要删除的文件或文件夹路径数组

#### 15. batch_create_files
批量创建文件
- **参数**：
  - `files` (必需): 文件信息数组，每个元素包含 `path` 和可选的 `content`

## 示例用法

### 在 Trae IDE 中使用自然语言

#### 基础操作示例
```
用户: 帮我创建一个名为 hello.txt 的文件，内容是 "Hello World"
助理: 我来帮你创建这个文件。
[使用 create_file 工具]

用户: 复制 hello.txt 到 backup 目录
助理: 我来复制文件到 backup 目录。
[使用 copy_file 工具]

用户: 显示当前目录的所有文件
助理: 我来列出当前目录的内容。
[使用 list_directory 工具]

用户: 搜索所有 .js 文件
助理: 我来搜索所有 JavaScript 文件。
[使用 search_files 工具]

用户: 删除 temp 文件夹
助理: 我来删除 temp 文件夹。
[使用 delete_file 工具]
```

#### 批量操作示例 🆕
```
用户: 批量读取 file1.txt、file2.txt 和 file3.txt 的内容
助理: 我来批量读取这些文件的内容。
[使用 batch_read_files 工具]

用户: 把 src 目录下的所有 .js 文件复制到 backup 目录
助理: 我先搜索所有 .js 文件，然后批量复制到 backup 目录。
[使用 search_files + batch_copy_files 工具]

用户: 批量创建多个配置文件：config.json、settings.yaml、env.txt
助理: 我来批量创建这些配置文件。
[使用 batch_create_files 工具]

用户: 清理所有临时文件：temp1.txt、temp2.log、cache.tmp
助理: 我来批量删除这些临时文件。
[使用 batch_delete_files 工具]

用户: 将多个日志文件移动到 logs 目录
助理: 我来批量移动这些日志文件。
[使用 batch_move_files 工具]
```

### API 调用示例

#### 创建文件
```json
{
  "name": "create_file",
  "arguments": {
    "path": "C:\\temp\\test.txt",
    "content": "Hello, World!"
  }
}
```

#### 复制文件
```json
{
  "name": "copy_file",
  "arguments": {
    "source": "C:\\temp\\test.txt",
    "destination": "C:\\backup\\test.txt"
  }
}
```

#### 搜索文件
```json
{
  "name": "search_files",
  "arguments": {
    "directory": "C:\\temp",
    "pattern": "*.txt",
    "recursive": true
  }
}
```

#### 批量读取文件
```json
{
  "name": "batch_read_files",
  "arguments": {
    "paths": ["file1.txt", "file2.txt", "file3.txt"]
  }
}
```

#### 批量复制文件
```json
{
  "name": "batch_copy_files",
  "arguments": {
    "sources": ["src/file1.js", "src/file2.js"],
    "destination": "./backup"
  }
}
```

#### 批量创建文件
```json
{
  "name": "batch_create_files",
  "arguments": {
    "files": [
      {"path": "config.json", "content": "{}"},
      {"path": "readme.md", "content": "# Project"}
    ]
  }
}
```

#### 批量删除文件
```json
{
  "name": "batch_delete_files",
  "arguments": {
    "paths": ["temp1.txt", "temp2.log", "cache/"]
  }
}
```

#### 批量移动文件
```json
{
  "name": "batch_move_files",
  "arguments": {
    "sources": ["log1.txt", "log2.txt"],
    "destination": "./logs"
  }
}
```

## 功能测试与验证

### 自动化测试

运行完整的功能测试：
```bash
node test.js
```

### 手动功能验证

运行功能测试指南：
```bash
node test-mcp-functionality.js
```

这将显示详细的测试步骤，您可以在 Trae IDE 中逐一验证每个功能。

### 使用示例脚本

查看详细的使用示例：
```bash
node example-usage.js
```

### 测试功能清单

- ✅ 文件创建和写入
- ✅ 文件读取和内容显示
- ✅ 文件复制和移动
- ✅ 目录创建和列表
- ✅ 文件信息获取
- ✅ 文件搜索（支持通配符）
- ✅ 文件和目录删除
- ✅ 错误处理和异常情况

## 技术栈

- **Node.js** - 运行时环境
- **@modelcontextprotocol/sdk** - MCP SDK
- **fs-extra** - 增强的文件系统操作
- **path** - 路径处理工具

## 注意事项

1. **路径处理**：所有路径都会被解析为绝对路径
2. **自动创建**：创建文件时会自动创建必要的父目录
3. **删除警告**：删除操作是不可逆的，请谨慎使用
4. **搜索模式**：搜索功能支持简单的通配符模式（* 匹配任意字符）
5. **权限显示**：文件权限以八进制格式显示
6. **编码支持**：支持 UTF-8 编码的文本文件
7. **路径分隔符**：在 Windows 系统中使用反斜杠（\\）作为路径分隔符

## 故障排除

### 常见问题

**Q: MCP 服务无法启动**
A: 请检查：
- Node.js 是否正确安装（建议 v16 或更高版本）
- 项目依赖是否已安装（运行 `npm install`）
- 路径配置是否正确

**Q: 文件操作权限被拒绝**
A: 请确保：
- 目标路径具有读写权限
- 文件未被其他程序占用
- 以管理员权限运行（如果需要）

**Q: 在 Trae IDE 中无法使用 MCP 功能**
A: 请验证：
- MCP 服务配置是否正确
- 服务是否成功启动
- 重启 Trae IDE 后重试

**Q: 中文文件名或路径出现乱码**
A: 确保：
- 系统编码设置为 UTF-8
- 文件路径使用正确的编码格式

### 调试方法

1. **检查服务状态**：
   ```bash
   node test.js
   ```

2. **验证功能**：
   ```bash
   node test-mcp-functionality.js
   ```

3. **查看详细日志**：
   服务运行时会输出详细的操作日志，有助于诊断问题

## 错误处理

服务包含完整的错误处理机制：

- **详细错误信息**：所有操作失败时都会返回详细的错误信息
- **中文错误提示**：错误信息使用中文显示，便于理解
- **操作状态反馈**：每个操作都有明确的成功/失败状态
- **异常捕获**：完善的异常捕获机制，避免服务崩溃

## 许可证

ISC