import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import './{{componentName}}.css';

/**
 * {{componentName}} - {{description}}
 * 
 * @author {{author}}
 * @version {{version}}
 * @created {{date}}
 */
const {{componentName}} = ({
  // Props
  title = '{{title}}',
  data = [],
  loading = false,
  error = null,
  className = '',
  style = {},
  onItemClick = () => {},
  onLoad = () => {},
  ...props
}) => {
  // State
  const [localState, setLocalState] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  // Effects
  useEffect(() => {
    // 组件挂载时的副作用
    console.log('{{componentName}} 组件已挂载');
    onLoad();
    
    // 清理函数
    return () => {
      console.log('{{componentName}} 组件即将卸载');
    };
  }, [onLoad]);

  useEffect(() => {
    // 数据变化时的副作用
    if (data && data.length > 0) {
      setLocalState(data[0]);
    }
  }, [data]);

  // Callbacks
  const handleItemClick = useCallback((item, index) => {
    setSelectedItem(item);
    onItemClick(item, index);
  }, [onItemClick]);

  const handleToggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const handleReset = useCallback(() => {
    setLocalState(null);
    setSelectedItem(null);
  }, []);

  // Memoized values
  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map((item, index) => ({
      ...item,
      id: item.id || `item-${index}`,
      isSelected: selectedItem && selectedItem.id === item.id
    }));
  }, [data, selectedItem]);

  const isEmpty = useMemo(() => {
    return !processedData || processedData.length === 0;
  }, [processedData]);

  const containerClasses = useMemo(() => {
    const classes = ['{{componentName}}'];
    
    if (className) classes.push(className);
    if (loading) classes.push('{{componentName}}--loading');
    if (error) classes.push('{{componentName}}--error');
    if (isEmpty) classes.push('{{componentName}}--empty');
    if (!isVisible) classes.push('{{componentName}}--hidden');
    
    return classes.join(' ');
  }, [className, loading, error, isEmpty, isVisible]);

  // Render helpers
  const renderHeader = () => (
    <div className="{{componentName}}__header">
      <h2 className="{{componentName}}__title">{title}</h2>
      <div className="{{componentName}}__actions">
        <button 
          className="{{componentName}}__toggle-btn"
          onClick={handleToggleVisibility}
          aria-label={isVisible ? '隐藏内容' : '显示内容'}
        >
          {isVisible ? '隐藏' : '显示'}
        </button>
        <button 
          className="{{componentName}}__reset-btn"
          onClick={handleReset}
          disabled={!selectedItem}
          aria-label="重置选择"
        >
          重置
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="{{componentName}}__loading">
      <div className="{{componentName}}__spinner" aria-label="加载中">
        <div className="spinner"></div>
      </div>
      <p>加载中...</p>
    </div>
  );

  const renderError = () => (
    <div className="{{componentName}}__error" role="alert">
      <h3>出现错误</h3>
      <p>{error.message || '未知错误'}</p>
      <button 
        className="{{componentName}}__retry-btn"
        onClick={() => onLoad()}
      >
        重试
      </button>
    </div>
  );

  const renderEmpty = () => (
    <div className="{{componentName}}__empty">
      <p>暂无数据</p>
    </div>
  );

  const renderItem = (item, index) => (
    <div
      key={item.id}
      className={`{{componentName}}__item ${
        item.isSelected ? '{{componentName}}__item--selected' : ''
      }`}
      onClick={() => handleItemClick(item, index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemClick(item, index);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={item.isSelected}
    >
      <div className="{{componentName}}__item-content">
        <h4 className="{{componentName}}__item-title">
          {item.title || item.name || `项目 ${index + 1}`}
        </h4>
        {item.description && (
          <p className="{{componentName}}__item-description">
            {item.description}
          </p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="{{componentName}}__item-tags">
            {item.tags.map((tag, tagIndex) => (
              <span 
                key={tagIndex} 
                className="{{componentName}}__tag"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {item.isSelected && (
        <div className="{{componentName}}__item-indicator" aria-hidden="true">
          ✓
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    if (isEmpty) return renderEmpty();

    return (
      <div className="{{componentName}}__content">
        {processedData.map(renderItem)}
      </div>
    );
  };

  // Main render
  return (
    <div 
      className={containerClasses}
      style={style}
      {...props}
    >
      {renderHeader()}
      {isVisible && renderContent()}
      
      {/* 选中项详情 */}
      {selectedItem && (
        <div className="{{componentName}}__selected-details">
          <h3>选中项详情</h3>
          <pre>{JSON.stringify(selectedItem, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// PropTypes
{{componentName}}.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  })),
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  className: PropTypes.string,
  style: PropTypes.object,
  onItemClick: PropTypes.func,
  onLoad: PropTypes.func
};

// Default export
export default {{componentName}};

// Named exports for testing
export {
  {{componentName}}
};

// 使用示例（在注释中）
/*
使用示例:

import {{componentName}} from './{{componentName}}';

const ExampleUsage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoad = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item, index) => {
    console.log('点击了项目:', item, '索引:', index);
  };

  return (
    <{{componentName}}
      title="示例列表"
      data={data}
      loading={loading}
      error={error}
      onLoad={handleLoad}
      onItemClick={handleItemClick}
      className="custom-class"
    />
  );
};
*/