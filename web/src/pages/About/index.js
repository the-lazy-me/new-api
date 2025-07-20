import React, { useEffect, useState } from 'react';
import { API, showError } from '../../helpers';
import { marked } from 'marked';
import { Empty, Timeline, Tag, Typography } from '@douyinfe/semi-ui';
import { IllustrationConstruction, IllustrationConstructionDark } from '@douyinfe/semi-illustrations';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

// Timeline 渲染组件
const TimelineRenderer = ({ data, t }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'hot':
        return 'red';
      case 'feature':
        return 'blue';
      case 'announcement':
        return 'green';
      default:
        return 'grey';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'hot':
        return t('热门');
      case 'feature':
        return t('功能');
      case 'announcement':
        return t('公告');
      default:
        return type;
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Timeline>
        {data.map((item, index) => (
          <Timeline.Item
            key={index}
            time={item.date}
            type={item.type === 'hot' ? 'warning' : 'primary'}
          >
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <Title heading={4} style={{ margin: 0, marginRight: '8px' }}>
                  {item.title}
                </Title>
                <Tag color={getTypeColor(item.type)} size="small">
                  {getTypeText(item.type)}
                </Tag>
              </div>
              {item.details && item.details.length > 0 && (
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {item.details.map((detail, detailIndex) => (
                    <li key={detailIndex} style={{ marginBottom: '4px' }}>
                      <Text>{detail}</Text>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

const About = () => {
  const { t } = useTranslation();
  const [about, setAbout] = useState('');
  const [aboutLoaded, setAboutLoaded] = useState(false);
  const [timelineData, setTimelineData] = useState(null);
  const [contentType, setContentType] = useState('html'); // 'html', 'iframe', 'timeline'
  const currentYear = new Date().getFullYear();

  const displayAbout = async () => {
    setAbout(localStorage.getItem('about') || '');
    const res = await API.get('/api/about');
    const { success, message, data } = res.data;
    if (success) {
      let aboutContent = data;

      // 检查是否为 URL
      if (data.startsWith('https://')) {
        setContentType('iframe');
        setAbout(data);
      } else {
        // 尝试解析为 JSON
        try {
          const jsonData = JSON.parse(data);
          if (Array.isArray(jsonData)) {
            setContentType('timeline');
            setTimelineData(jsonData);
            setAbout(''); // 清空 about 内容
          } else {
            throw new Error('Not a valid timeline array');
          }
        } catch (e) {
          // 如果不是有效的 JSON，则按 Markdown 处理
          setContentType('html');
          aboutContent = marked.parse(data);
          setAbout(aboutContent);
        }
      }

      localStorage.setItem('about', data); // 存储原始数据
    } else {
      showError(message);
      setAbout(t('加载关于内容失败...'));
      setContentType('html');
    }
    setAboutLoaded(true);
  };

  useEffect(() => {
    displayAbout().then();
  }, []);

  const emptyStyle = {
    padding: '24px'
  };

  const customDescription = (
    <div style={{ textAlign: 'center' }}>
      <p>{t('可在设置页面设置关于内容，支持 HTML & Markdown & JSON Timeline')}</p>
      {t('New API项目仓库地址：')}
      <a
        href='https://github.com/QuantumNous/new-api'
        target="_blank"
        rel="noopener noreferrer"
        className="!text-semi-color-primary"
      >
        https://github.com/QuantumNous/new-api
      </a>
      <p>
        <a
          href="https://github.com/QuantumNous/new-api"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-semi-color-primary"
        >
          NewAPI
        </a> {t('© {{currentYear}}', { currentYear })} <a
          href="https://github.com/QuantumNous"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-semi-color-primary"
        >
          QuantumNous
        </a> {t('| 基于')} <a
          href="https://github.com/songquanpeng/one-api/releases/tag/v0.5.4"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-semi-color-primary"
        >
          One API v0.5.4
        </a> © 2023 <a
          href="https://github.com/songquanpeng"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-semi-color-primary"
        >
          JustSong
        </a>
      </p>
      <p>
        {t('本项目根据')}
        <a
          href="https://github.com/songquanpeng/one-api/blob/v0.5.4/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-semi-color-primary"
        >
          {t('MIT许可证')}
        </a>
        {t('授权，需在遵守')}
        <a
          href="https://github.com/QuantumNous/new-api/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="!text-semi-color-primary"
        >
          {t('Apache-2.0协议')}
        </a>
        {t('的前提下使用。')}
      </p>
    </div>
  );

  return (
    <div className="mt-[64px]">
      {aboutLoaded && about === '' && !timelineData ? (
        <div className="flex justify-center items-center h-screen p-8">
          <Empty
            image={<IllustrationConstruction style={{ width: 150, height: 150 }} />}
            darkModeImage={<IllustrationConstructionDark style={{ width: 150, height: 150 }} />}
            description={t('管理员暂时未设置任何关于内容')}
            style={emptyStyle}
          >
            {customDescription}
          </Empty>
        </div>
      ) : (
        <>
          {contentType === 'iframe' && (
            <iframe
              src={about}
              style={{ width: '100%', height: '100vh', border: 'none' }}
            />
          )}
          {contentType === 'html' && (
            <div
              style={{ fontSize: 'larger' }}
              dangerouslySetInnerHTML={{ __html: about }}
            ></div>
          )}
          {contentType === 'timeline' && timelineData && (
            <TimelineRenderer data={timelineData} t={t} />
          )}
        </>
      )}
    </div>
  );
};

export default About;
