// FileManager MCP 服务使用示例
// 这个文件展示了如何使用各种文件管理功能

const examples = {
  // 1. 创建文件
  createFile: {
    name: 'create_file',
    arguments: {
      path: 'C:\\temp\\example.txt',
      content: 'Hello, this is a test file created by FileManager MCP!'
    }
  },

  // 2. 读取文件
  readFile: {
    name: 'read_file',
    arguments: {
      path: 'C:\\temp\\example.txt'
    }
  },

  // 3. 写入文件（编辑）
  writeFile: {
    name: 'write_file',
    arguments: {
      path: 'C:\\temp\\example.txt',
      content: 'Updated content: This file has been modified!'
    }
  },

  // 4. 复制文件
  copyFile: {
    name: 'copy_file',
    arguments: {
      source: 'C:\\temp\\example.txt',
      destination: 'C:\\temp\\example_copy.txt'
    }
  },

  // 5. 移动/重命名文件
  moveFile: {
    name: 'move_file',
    arguments: {
      source: 'C:\\temp\\example_copy.txt',
      destination: 'C:\\temp\\renamed_example.txt'
    }
  },

  // 6. 创建目录
  createDirectory: {
    name: 'create_directory',
    arguments: {
      path: 'C:\\temp\\test_folder'
    }
  },

  // 7. 列出目录内容
  listDirectory: {
    name: 'list_directory',
    arguments: {
      path: 'C:\\temp',
      detailed: true
    }
  },

  // 8. 获取文件信息
  getFileInfo: {
    name: 'get_file_info',
    arguments: {
      path: 'C:\\temp\\example.txt'
    }
  },

  // 9. 搜索文件
  searchFiles: {
    name: 'search_files',
    arguments: {
      directory: 'C:\\temp',
      pattern: '*.txt',
      recursive: true
    }
  },

  // 10. 删除文件
  deleteFile: {
    name: 'delete_file',
    arguments: {
      path: 'C:\\temp\\example.txt'
    }
  }
};

console.log('FileManager MCP 服务使用示例');
console.log('=' .repeat(50));
console.log('\n以下是各种功能的调用示例：\n');

Object.entries(examples).forEach(([key, example], index) => {
  console.log(`${index + 1}. ${key}:`);
  console.log(JSON.stringify(example, null, 2));
  console.log('');
});

console.log('注意事项:');
console.log('- 请确保路径存在或有权限创建');
console.log('- 删除操作是不可逆的，请谨慎使用');
console.log('- 搜索支持通配符模式（* 匹配任意字符）');
console.log('- 所有路径都会被解析为绝对路径');