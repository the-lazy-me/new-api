import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography, Skeleton } from '@douyinfe/semi-ui';
import { useTranslation } from 'react-i18next';
import { API, showError } from '../../helpers';
import ReactMarkdown from 'react-markdown';
import RemarkMath from 'remark-math';
import RemarkBreaks from 'remark-breaks';
import RehypeKatex from 'rehype-katex';
import RemarkGfm from 'remark-gfm';
import RehypeHighlight from 'rehype-highlight';
import { Megaphone } from 'lucide-react';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

const { Title } = Typography;

// 简单的HTML检测函数
const isHtmlContent = (content) => {
  return /<[^>]+>/g.test(content);
};

// 内容渲染组件
const NoticeContent = ({ content }) => {
  const isHtml = useMemo(() => isHtmlContent(content), [content]);

  if (isHtml) {
    // 直接渲染HTML内容
    return (
      <div
        className="topup-notice-html-content"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      />
    );
  } else {
    // 渲染Markdown内容
    return (
      <div
        className="topup-notice-markdown-content"
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        <ReactMarkdown
          remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
          rehypePlugins={[
            RehypeKatex,
            [RehypeHighlight, { detect: false, ignoreMissing: true }]
          ]}
          components={{
            p: (pProps) => <p {...pProps} style={{ lineHeight: '1.6', margin: '0 0 12px 0' }} />,
            a: (aProps) => (
              <a
                {...aProps}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--semi-color-primary)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.target.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.target.style.textDecoration = 'none';
                }}
              />
            ),
            ul: (props) => <ul {...props} style={{ margin: '0 0 12px 0', paddingLeft: '20px' }} />,
            ol: (props) => <ol {...props} style={{ margin: '0 0 12px 0', paddingLeft: '20px' }} />,
            li: (props) => <li {...props} style={{ margin: '4px 0' }} />,
            h1: (props) => <h1 {...props} style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold' }} />,
            h2: (props) => <h2 {...props} style={{ margin: '0 0 14px 0', fontSize: '16px', fontWeight: 'bold' }} />,
            h3: (props) => <h3 {...props} style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold' }} />,
            blockquote: (props) => (
              <blockquote
                {...props}
                style={{
                  margin: '0 0 12px 0',
                  paddingLeft: '12px',
                  borderLeft: '3px solid var(--semi-color-primary)',
                  color: 'var(--semi-color-text-1)',
                  fontStyle: 'italic'
                }}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
};

const TopUpNotice = ({ className = '', style = {} }) => {
  const { t } = useTranslation();
  const [noticeContent, setNoticeContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasContent, setHasContent] = useState(false);

  const fetchTopUpNotice = async () => {
    setLoading(true);
    try {
      const res = await API.get('/api/topup_notice');
      const { success, message, data } = res.data;
      if (success) {
        if (data && data.trim() !== '') {
          setNoticeContent(data);
          setHasContent(true);
        } else {
          setHasContent(false);
        }
      } else {
        showError(message);
        setHasContent(false);
      }
    } catch (error) {
      console.error('获取充值公告失败:', error);
      setHasContent(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopUpNotice();
  }, []);

  // 如果正在加载，显示骨架屏
  if (loading) {
    return (
      <Card
        className={`!rounded-2xl ${className}`}
        shadows='always'
        bordered={false}
        style={style}
        header={
          <div className='px-5 py-4 pb-0'>
            <div className='flex items-center'>
              <div className='mr-3 shadow-md flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                <Megaphone size={16} className='text-orange-600' />
              </div>
              <div>
                <Title heading={5} style={{ margin: 0 }}>
                  {t('充值公告')}
                </Title>
              </div>
            </div>
          </div>
        }
      >
        <div className='space-y-3'>
          <Skeleton.Paragraph rows={3} />
        </div>
      </Card>
    );
  }

  // 如果没有内容，不渲染组件
  if (!hasContent) {
    return null;
  }

  return (
    <Card
      className={`!rounded-2xl ${className}`}
      shadows='always'
      bordered={false}
      style={style}
      header={
        <div className='px-5 py-4 pb-0'>
          <div className='flex items-center'>
            <div className='mr-3 shadow-md flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
              <Megaphone size={16} className='text-orange-600' />
            </div>
            <div>
              <Title heading={5} style={{ margin: 0 }}>
                {t('充值公告')}
              </Title>
            </div>
          </div>
        </div>
      }
    >
      <div className='space-y-4'>
        <NoticeContent content={noticeContent} />
      </div>
    </Card>
  );
};

export default TopUpNotice;
