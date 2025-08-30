#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
{{title}}
{{description}}

Author: {{author}}
Version: {{version}}
Created: {{date}}
Python Version: 3.7+
"""

import os
import sys
import json
import logging
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Union, Any
from datetime import datetime
import asyncio

# 第三方库导入（根据需要取消注释）
# import requests
# import pandas as pd
# import numpy as np


# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('{{filename}}.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


# 配置常量
class Config:
    """配置类"""
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'
    VERSION = '{{version}}'
    BASE_DIR = Path(__file__).parent
    DATA_DIR = BASE_DIR / 'data'
    OUTPUT_DIR = BASE_DIR / 'output'
    
    # 确保目录存在
    DATA_DIR.mkdir(exist_ok=True)
    OUTPUT_DIR.mkdir(exist_ok=True)


class {{className}}:
    """主类"""
    
    def __init__(self, config: Optional[Dict] = None):
        """初始化
        
        Args:
            config: 配置字典
        """
        self.config = config or {}
        self.logger = logging.getLogger(self.__class__.__name__)
        self._setup()
    
    def _setup(self) -> None:
        """设置初始化"""
        self.logger.info(f"初始化 {self.__class__.__name__}...")
        
        # 在这里添加初始化逻辑
        
    def run(self) -> None:
        """运行主逻辑"""
        try:
            self.logger.info("开始执行主逻辑")
            
            # 在这里添加主要业务逻辑
            self._process_data()
            
            self.logger.info("执行完成")
            
        except Exception as e:
            self.logger.error(f"执行失败: {e}")
            raise
    
    def _process_data(self) -> None:
        """处理数据的示例方法"""
        self.logger.info("处理数据中...")
        
        # 示例：读取数据
        data = self._load_data()
        
        # 示例：处理数据
        processed_data = self._transform_data(data)
        
        # 示例：保存结果
        self._save_data(processed_data)
    
    def _load_data(self) -> Dict[str, Any]:
        """加载数据
        
        Returns:
            加载的数据
        """
        try:
            # 示例：从JSON文件加载数据
            data_file = Config.DATA_DIR / 'input.json'
            if data_file.exists():
                with open(data_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                self.logger.warning(f"数据文件不存在: {data_file}")
                return {}
                
        except Exception as e:
            self.logger.error(f"加载数据失败: {e}")
            return {}
    
    def _transform_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """转换数据
        
        Args:
            data: 原始数据
            
        Returns:
            转换后的数据
        """
        try:
            # 在这里添加数据转换逻辑
            processed_data = {
                'timestamp': datetime.now().isoformat(),
                'original_data': data,
                'processed': True
            }
            
            return processed_data
            
        except Exception as e:
            self.logger.error(f"数据转换失败: {e}")
            raise
    
    def _save_data(self, data: Dict[str, Any]) -> None:
        """保存数据
        
        Args:
            data: 要保存的数据
        """
        try:
            output_file = Config.OUTPUT_DIR / f'output_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            self.logger.info(f"数据已保存到: {output_file}")
            
        except Exception as e:
            self.logger.error(f"保存数据失败: {e}")
            raise
    
    async def async_process(self) -> None:
        """异步处理示例"""
        self.logger.info("开始异步处理")
        
        # 示例异步任务
        tasks = [
            self._async_task(i) for i in range(3)
        ]
        
        results = await asyncio.gather(*tasks)
        self.logger.info(f"异步处理完成，结果: {results}")
    
    async def _async_task(self, task_id: int) -> str:
        """异步任务示例
        
        Args:
            task_id: 任务ID
            
        Returns:
            任务结果
        """
        await asyncio.sleep(1)  # 模拟异步操作
        return f"Task {task_id} completed"


class Utils:
    """工具类"""
    
    @staticmethod
    def format_date(date: Optional[datetime] = None) -> str:
        """格式化日期
        
        Args:
            date: 日期对象，默认为当前时间
            
        Returns:
            格式化的日期字符串
        """
        if date is None:
            date = datetime.now()
        return date.strftime('%Y-%m-%d %H:%M:%S')
    
    @staticmethod
    def read_file(file_path: Union[str, Path], encoding: str = 'utf-8') -> str:
        """读取文件
        
        Args:
            file_path: 文件路径
            encoding: 文件编码
            
        Returns:
            文件内容
        """
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except Exception as e:
            logger.error(f"读取文件失败 {file_path}: {e}")
            raise
    
    @staticmethod
    def write_file(file_path: Union[str, Path], content: str, encoding: str = 'utf-8') -> None:
        """写入文件
        
        Args:
            file_path: 文件路径
            content: 文件内容
            encoding: 文件编码
        """
        try:
            # 确保目录存在
            Path(file_path).parent.mkdir(parents=True, exist_ok=True)
            
            with open(file_path, 'w', encoding=encoding) as f:
                f.write(content)
                
            logger.info(f"文件已写入: {file_path}")
            
        except Exception as e:
            logger.error(f"写入文件失败 {file_path}: {e}")
            raise
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """验证邮箱格式
        
        Args:
            email: 邮箱地址
            
        Returns:
            是否为有效邮箱
        """
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None


def create_argument_parser() -> argparse.ArgumentParser:
    """创建命令行参数解析器
    
    Returns:
        参数解析器
    """
    parser = argparse.ArgumentParser(
        description='{{description}}',
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument(
        '--version',
        action='version',
        version=f'%(prog)s {Config.VERSION}'
    )
    
    parser.add_argument(
        '--debug',
        action='store_true',
        help='启用调试模式'
    )
    
    parser.add_argument(
        '--config',
        type=str,
        help='配置文件路径'
    )
    
    parser.add_argument(
        '--async',
        action='store_true',
        dest='use_async',
        help='使用异步模式'
    )
    
    return parser


def main() -> None:
    """主函数"""
    parser = create_argument_parser()
    args = parser.parse_args()
    
    # 设置日志级别
    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)
        logger.debug("调试模式已启用")
    
    try:
        # 创建应用实例
        app = {{className}}()
        
        if args.use_async:
            # 异步模式
            asyncio.run(app.async_process())
        else:
            # 同步模式
            app.run()
            
    except KeyboardInterrupt:
        logger.info("程序被用户中断")
        sys.exit(0)
    except Exception as e:
        logger.error(f"程序执行失败: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()