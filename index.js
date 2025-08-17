#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

class FileManagerServer {
  constructor() {
    this.server = new Server(
      {
        name: 'filemanager',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_file',
          description: '创建新文件',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '文件路径'
              },
              content: {
                type: 'string',
                description: '文件内容（可选）',
                default: ''
              }
            },
            required: ['path']
          }
        },
        {
          name: 'delete_file',
          description: '删除文件或文件夹',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '要删除的文件或文件夹路径'
              }
            },
            required: ['path']
          }
        },
        {
          name: 'read_file',
          description: '读取文件内容',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '文件路径'
              }
            },
            required: ['path']
          }
        },
        {
          name: 'write_file',
          description: '写入或编辑文件内容',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '文件路径'
              },
              content: {
                type: 'string',
                description: '要写入的内容'
              }
            },
            required: ['path', 'content']
          }
        },
        {
          name: 'copy_file',
          description: '复制文件或文件夹',
          inputSchema: {
            type: 'object',
            properties: {
              source: {
                type: 'string',
                description: '源文件或文件夹路径'
              },
              destination: {
                type: 'string',
                description: '目标路径'
              }
            },
            required: ['source', 'destination']
          }
        },
        {
          name: 'move_file',
          description: '移动或重命名文件/文件夹（剪切功能）',
          inputSchema: {
            type: 'object',
            properties: {
              source: {
                type: 'string',
                description: '源文件或文件夹路径'
              },
              destination: {
                type: 'string',
                description: '目标路径'
              }
            },
            required: ['source', 'destination']
          }
        },
        {
          name: 'list_directory',
          description: '列出目录内容',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '目录路径'
              },
              detailed: {
                type: 'boolean',
                description: '是否显示详细信息（大小、修改时间等）',
                default: false
              }
            },
            required: ['path']
          }
        },
        {
          name: 'get_file_info',
          description: '获取文件或文件夹属性信息',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '文件或文件夹路径'
              }
            },
            required: ['path']
          }
        },
        {
          name: 'create_directory',
          description: '创建目录',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '目录路径'
              }
            },
            required: ['path']
          }
        },
        {
          name: 'search_files',
          description: '搜索文件',
          inputSchema: {
            type: 'object',
            properties: {
              directory: {
                type: 'string',
                description: '搜索目录'
              },
              pattern: {
                type: 'string',
                description: '搜索模式（文件名模式）'
              },
              recursive: {
                type: 'boolean',
                description: '是否递归搜索子目录',
                default: true
              }
            },
            required: ['directory', 'pattern']
          }
        },
        {
          name: 'batch_read_files',
          description: '批量读取多个文件的内容',
          inputSchema: {
            type: 'object',
            properties: {
              paths: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: '要读取的文件路径列表'
              },
              encoding: {
                type: 'string',
                description: '文件编码',
                default: 'utf8'
              }
            },
            required: ['paths']
          }
        },
        {
          name: 'batch_copy_files',
          description: '批量复制文件到目标目录',
          inputSchema: {
            type: 'object',
            properties: {
              sources: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: '源文件路径列表'
              },
              destination: {
                type: 'string',
                description: '目标目录路径'
              },
              preserve_structure: {
                type: 'boolean',
                description: '是否保持原有目录结构',
                default: false
              }
            },
            required: ['sources', 'destination']
          }
        },
        {
          name: 'batch_move_files',
          description: '批量移动文件到目标目录',
          inputSchema: {
            type: 'object',
            properties: {
              sources: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: '源文件路径列表'
              },
              destination: {
                type: 'string',
                description: '目标目录路径'
              },
              preserve_structure: {
                type: 'boolean',
                description: '是否保持原有目录结构',
                default: false
              }
            },
            required: ['sources', 'destination']
          }
        },
        {
          name: 'batch_delete_files',
          description: '批量删除文件或文件夹',
          inputSchema: {
            type: 'object',
            properties: {
              paths: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: '要删除的文件或文件夹路径列表'
              },
              force: {
                type: 'boolean',
                description: '是否强制删除（忽略错误）',
                default: false
              }
            },
            required: ['paths']
          }
        },
        {
          name: 'batch_create_files',
          description: '批量创建文件',
          inputSchema: {
            type: 'object',
            properties: {
              files: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    path: {
                      type: 'string',
                      description: '文件路径'
                    },
                    content: {
                      type: 'string',
                      description: '文件内容',
                      default: ''
                    }
                  },
                  required: ['path']
                },
                description: '要创建的文件列表'
              }
            },
            required: ['files']
          }
        }
      ]
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_file':
            return await this.createFile(args.path, args.content || '');
          case 'delete_file':
            return await this.deleteFile(args.path);
          case 'read_file':
            return await this.readFile(args.path);
          case 'write_file':
            return await this.writeFile(args.path, args.content);
          case 'copy_file':
            return await this.copyFile(args.source, args.destination);
          case 'move_file':
            return await this.moveFile(args.source, args.destination);
          case 'list_directory':
            return await this.listDirectory(args.path, args.detailed);
          case 'get_file_info':
            return await this.getFileInfo(args.path);
          case 'create_directory':
            return await this.createDirectory(args.path);
          case 'search_files':
            return await this.searchFiles(args.directory, args.pattern, args.recursive);
          case 'batch_read_files':
            return await this.batchReadFiles(args.paths, args.encoding);
          case 'batch_copy_files':
            return await this.batchCopyFiles(args.sources, args.destination, args.preserve_structure);
          case 'batch_move_files':
            return await this.batchMoveFiles(args.sources, args.destination, args.preserve_structure);
          case 'batch_delete_files':
            return await this.batchDeleteFiles(args.paths, args.force);
          case 'batch_create_files':
            return await this.batchCreateFiles(args.files);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${error.message}`
        );
      }
    });
  }

  async createFile(filePath, content = '') {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.ensureDir(path.dirname(absolutePath));
      await fs.writeFile(absolutePath, content, 'utf8');
      return {
        content: [{
          type: 'text',
          text: `文件创建成功: ${absolutePath}`
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `创建文件失败: ${error.message}`
      );
    }
  }

  async deleteFile(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const exists = await fs.pathExists(absolutePath);
      if (!exists) {
        throw new Error('文件或文件夹不存在');
      }
      await fs.remove(absolutePath);
      return {
        content: [{
          type: 'text',
          text: `删除成功: ${absolutePath}`
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `删除失败: ${error.message}`
      );
    }
  }

  async readFile(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const content = await fs.readFile(absolutePath, 'utf8');
      return {
        content: [{
          type: 'text',
          text: `文件内容 (${absolutePath}):\n\n${content}`
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `读取文件失败: ${error.message}`
      );
    }
  }

  async writeFile(filePath, content) {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.ensureDir(path.dirname(absolutePath));
      await fs.writeFile(absolutePath, content, 'utf8');
      return {
        content: [{
          type: 'text',
          text: `文件写入成功: ${absolutePath}`
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `写入文件失败: ${error.message}`
      );
    }
  }

  async copyFile(source, destination) {
    try {
      const sourcePath = path.resolve(source);
      const destPath = path.resolve(destination);
      
      const sourceExists = await fs.pathExists(sourcePath);
      if (!sourceExists) {
        throw new Error('源文件或文件夹不存在');
      }

      await fs.copy(sourcePath, destPath);
      return {
        content: [{
          type: 'text',
          text: `复制成功: ${sourcePath} -> ${destPath}`
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `复制失败: ${error.message}`
      );
    }
  }

  async moveFile(source, destination) {
    try {
      const sourcePath = path.resolve(source);
      const destPath = path.resolve(destination);
      
      const sourceExists = await fs.pathExists(sourcePath);
      if (!sourceExists) {
        throw new Error('源文件或文件夹不存在');
      }

      await fs.move(sourcePath, destPath);
      return {
        content: [{
          type: 'text',
          text: `移动成功: ${sourcePath} -> ${destPath}`
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `移动失败: ${error.message}`
      );
    }
  }

  async listDirectory(dirPath, detailed = false) {
    try {
      const absolutePath = path.resolve(dirPath);
      const exists = await fs.pathExists(absolutePath);
      if (!exists) {
        throw new Error('目录不存在');
      }

      const stat = await fs.stat(absolutePath);
      if (!stat.isDirectory()) {
        throw new Error('指定路径不是目录');
      }

      let items = [];
      let readdirError = null;
      
      try {
        items = await fs.readdir(absolutePath);
      } catch (error) {
        readdirError = error;
        // 如果readdir失败，尝试使用child_process调用PowerShell
        try {
          const { exec } = require('child_process');
          const { promisify } = require('util');
          const execAsync = promisify(exec);
          
          const psCommand = `Get-ChildItem "${absolutePath}" -Force -ErrorAction SilentlyContinue | Select-Object Name -ExpandProperty Name`;
          const { stdout } = await execAsync(`powershell -Command "${psCommand}"`);
          items = stdout.trim().split('\n').filter(item => item.trim() !== '');
        } catch (psError) {
          throw new Error(`无法读取目录内容: ${error.message}`);
        }
      }
      
      let result = `目录内容 (${absolutePath}):\n\n`;
      let skippedItems = [];
      
      if (readdirError) {
        result += `注意: 使用PowerShell读取目录内容 (Node.js权限不足)\n\n`;
      }

      if (detailed) {
        for (const item of items) {
          try {
            const itemPath = path.join(absolutePath, item);
            const itemStat = await fs.stat(itemPath);
            const type = itemStat.isDirectory() ? '[目录]' : '[文件]';
            const size = itemStat.isFile() ? `${itemStat.size} bytes` : '';
            const modified = itemStat.mtime.toLocaleString();
            result += `${type} ${item} ${size} (修改时间: ${modified})\n`;
          } catch (itemError) {
            // 跳过无权限访问的文件/目录
            skippedItems.push(`${item} (权限不足)`);
          }
        }
      } else {
        for (const item of items) {
          try {
            const itemPath = path.join(absolutePath, item);
            const itemStat = await fs.stat(itemPath);
            const type = itemStat.isDirectory() ? '[目录]' : '[文件]';
            result += `${type} ${item}\n`;
          } catch (itemError) {
            // 跳过无权限访问的文件/目录
            skippedItems.push(`${item} (权限不足)`);
          }
        }
      }

      if (skippedItems.length > 0) {
        result += `\n跳过的项目 (权限不足):\n`;
        skippedItems.forEach(item => {
          result += `[跳过] ${item}\n`;
        });
      }

      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `列出目录失败: ${error.message}`
      );
    }
  }

  async getFileInfo(filePath) {
    try {
      const absolutePath = path.resolve(filePath);
      const exists = await fs.pathExists(absolutePath);
      if (!exists) {
        throw new Error('文件或文件夹不存在');
      }

      const stat = await fs.stat(absolutePath);
      const info = {
        path: absolutePath,
        name: path.basename(absolutePath),
        type: stat.isDirectory() ? '目录' : '文件',
        size: stat.size,
        created: stat.birthtime.toLocaleString(),
        modified: stat.mtime.toLocaleString(),
        accessed: stat.atime.toLocaleString(),
        permissions: stat.mode.toString(8)
      };

      let result = `文件信息:\n`;
      result += `路径: ${info.path}\n`;
      result += `名称: ${info.name}\n`;
      result += `类型: ${info.type}\n`;
      result += `大小: ${info.size} bytes\n`;
      result += `创建时间: ${info.created}\n`;
      result += `修改时间: ${info.modified}\n`;
      result += `访问时间: ${info.accessed}\n`;
      result += `权限: ${info.permissions}\n`;

      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `获取文件信息失败: ${error.message}`
      );
    }
  }

  async createDirectory(dirPath) {
    try {
      const absolutePath = path.resolve(dirPath);
      await fs.ensureDir(absolutePath);
      return {
        content: [{
          type: 'text',
          text: `目录创建成功: ${absolutePath}`
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `创建目录失败: ${error.message}`
      );
    }
  }

  async searchFiles(directory, pattern, recursive = true) {
    try {
      const absolutePath = path.resolve(directory);
      const exists = await fs.pathExists(absolutePath);
      if (!exists) {
        throw new Error('搜索目录不存在');
      }

      const results = [];
      await this.searchFilesRecursive(absolutePath, pattern, recursive, results);

      let result = `搜索结果 (模式: ${pattern}, 目录: ${absolutePath}):\n\n`;
      if (results.length === 0) {
        result += '未找到匹配的文件\n';
      } else {
        results.forEach(file => {
          result += `${file}\n`;
        });
      }

      return {
        content: [{
          type: 'text',
          text: result
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `搜索文件失败: ${error.message}`
      );
    }
  }

  async searchFilesRecursive(dir, pattern, recursive, results) {
    const items = await fs.readdir(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isFile()) {
        // 简单的模式匹配（支持通配符*）
        const regex = new RegExp(pattern.replace(/\*/g, '.*'), 'i');
        if (regex.test(item)) {
          results.push(itemPath);
        }
      } else if (stat.isDirectory() && recursive) {
        await this.searchFilesRecursive(itemPath, pattern, recursive, results);
      }
    }
  }

  async batchReadFiles(paths, encoding = 'utf8') {
    try {
      const results = [];
      const errors = [];
      
      for (const filePath of paths) {
        try {
          const absolutePath = path.resolve(filePath);
          const exists = await fs.pathExists(absolutePath);
          if (!exists) {
            errors.push(`文件不存在: ${absolutePath}`);
            continue;
          }
          
          const stat = await fs.stat(absolutePath);
          if (!stat.isFile()) {
            errors.push(`不是文件: ${absolutePath}`);
            continue;
          }
          
          const content = await fs.readFile(absolutePath, encoding);
          results.push({
            path: absolutePath,
            content: content,
            size: stat.size
          });
        } catch (error) {
          errors.push(`读取失败 ${filePath}: ${error.message}`);
        }
      }
      
      let resultText = `批量读取文件结果 (共处理 ${paths.length} 个文件):\n\n`;
      
      if (results.length > 0) {
        resultText += `成功读取 ${results.length} 个文件:\n`;
        results.forEach((result, index) => {
          resultText += `\n--- 文件 ${index + 1}: ${result.path} (${result.size} bytes) ---\n`;
          resultText += result.content;
          resultText += '\n--- 文件结束 ---\n';
        });
      }
      
      if (errors.length > 0) {
        resultText += `\n错误信息 (${errors.length} 个):\n`;
        errors.forEach(error => {
          resultText += `- ${error}\n`;
        });
      }
      
      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `批量读取文件失败: ${error.message}`
      );
    }
  }

  async batchCopyFiles(sources, destination, preserveStructure = false) {
    try {
      const destPath = path.resolve(destination);
      await fs.ensureDir(destPath);
      
      const results = [];
      const errors = [];
      
      for (const source of sources) {
        try {
          const sourcePath = path.resolve(source);
          const exists = await fs.pathExists(sourcePath);
          if (!exists) {
            errors.push(`源文件不存在: ${sourcePath}`);
            continue;
          }
          
          let targetPath;
          if (preserveStructure) {
            // 保持目录结构
            const relativePath = path.relative(process.cwd(), sourcePath);
            targetPath = path.join(destPath, relativePath);
          } else {
            // 直接复制到目标目录
            const fileName = path.basename(sourcePath);
            targetPath = path.join(destPath, fileName);
          }
          
          await fs.ensureDir(path.dirname(targetPath));
          await fs.copy(sourcePath, targetPath);
          results.push(`${sourcePath} -> ${targetPath}`);
        } catch (error) {
          errors.push(`复制失败 ${source}: ${error.message}`);
        }
      }
      
      let resultText = `批量复制文件结果 (共处理 ${sources.length} 个文件):\n\n`;
      
      if (results.length > 0) {
        resultText += `成功复制 ${results.length} 个文件:\n`;
        results.forEach(result => {
          resultText += `- ${result}\n`;
        });
      }
      
      if (errors.length > 0) {
        resultText += `\n错误信息 (${errors.length} 个):\n`;
        errors.forEach(error => {
          resultText += `- ${error}\n`;
        });
      }
      
      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `批量复制文件失败: ${error.message}`
      );
    }
  }

  async batchMoveFiles(sources, destination, preserveStructure = false) {
    try {
      const destPath = path.resolve(destination);
      await fs.ensureDir(destPath);
      
      const results = [];
      const errors = [];
      
      for (const source of sources) {
        try {
          const sourcePath = path.resolve(source);
          const exists = await fs.pathExists(sourcePath);
          if (!exists) {
            errors.push(`源文件不存在: ${sourcePath}`);
            continue;
          }
          
          let targetPath;
          if (preserveStructure) {
            // 保持目录结构
            const relativePath = path.relative(process.cwd(), sourcePath);
            targetPath = path.join(destPath, relativePath);
          } else {
            // 直接移动到目标目录
            const fileName = path.basename(sourcePath);
            targetPath = path.join(destPath, fileName);
          }
          
          await fs.ensureDir(path.dirname(targetPath));
          await fs.move(sourcePath, targetPath);
          results.push(`${sourcePath} -> ${targetPath}`);
        } catch (error) {
          errors.push(`移动失败 ${source}: ${error.message}`);
        }
      }
      
      let resultText = `批量移动文件结果 (共处理 ${sources.length} 个文件):\n\n`;
      
      if (results.length > 0) {
        resultText += `成功移动 ${results.length} 个文件:\n`;
        results.forEach(result => {
          resultText += `- ${result}\n`;
        });
      }
      
      if (errors.length > 0) {
        resultText += `\n错误信息 (${errors.length} 个):\n`;
        errors.forEach(error => {
          resultText += `- ${error}\n`;
        });
      }
      
      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `批量移动文件失败: ${error.message}`
      );
    }
  }

  async batchDeleteFiles(paths, force = false) {
    try {
      const results = [];
      const errors = [];
      
      for (const filePath of paths) {
        try {
          const absolutePath = path.resolve(filePath);
          const exists = await fs.pathExists(absolutePath);
          if (!exists) {
            if (force) {
              results.push(`跳过不存在的文件: ${absolutePath}`);
              continue;
            } else {
              errors.push(`文件不存在: ${absolutePath}`);
              continue;
            }
          }
          
          await fs.remove(absolutePath);
          results.push(`删除成功: ${absolutePath}`);
        } catch (error) {
          if (force) {
            results.push(`删除失败但继续: ${filePath} (${error.message})`);
          } else {
            errors.push(`删除失败 ${filePath}: ${error.message}`);
          }
        }
      }
      
      let resultText = `批量删除文件结果 (共处理 ${paths.length} 个文件):\n\n`;
      
      if (results.length > 0) {
        resultText += `处理结果 (${results.length} 个):\n`;
        results.forEach(result => {
          resultText += `- ${result}\n`;
        });
      }
      
      if (errors.length > 0) {
        resultText += `\n错误信息 (${errors.length} 个):\n`;
        errors.forEach(error => {
          resultText += `- ${error}\n`;
        });
      }
      
      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `批量删除文件失败: ${error.message}`
      );
    }
  }

  async batchCreateFiles(files) {
    try {
      const results = [];
      const errors = [];
      
      for (const file of files) {
        try {
          const absolutePath = path.resolve(file.path);
          const content = file.content || '';
          
          await fs.ensureDir(path.dirname(absolutePath));
          await fs.writeFile(absolutePath, content, 'utf8');
          results.push(`创建成功: ${absolutePath} (${content.length} 字符)`);
        } catch (error) {
          errors.push(`创建失败 ${file.path}: ${error.message}`);
        }
      }
      
      let resultText = `批量创建文件结果 (共处理 ${files.length} 个文件):\n\n`;
      
      if (results.length > 0) {
        resultText += `成功创建 ${results.length} 个文件:\n`;
        results.forEach(result => {
          resultText += `- ${result}\n`;
        });
      }
      
      if (errors.length > 0) {
        resultText += `\n错误信息 (${errors.length} 个):\n`;
        errors.forEach(error => {
          resultText += `- ${error}\n`;
        });
      }
      
      return {
        content: [{
          type: 'text',
          text: resultText
        }]
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `批量创建文件失败: ${error.message}`
      );
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('FileManager MCP server running on stdio');
  }
}

// 导出FileManager类供测试使用
module.exports = FileManagerServer;

// 如果直接运行此文件，启动MCP服务器
if (require.main === module) {
  const server = new FileManagerServer();
  server.run().catch(console.error);
}