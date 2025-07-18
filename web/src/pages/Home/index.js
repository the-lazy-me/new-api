import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Typography, Card, Space } from '@douyinfe/semi-ui';
import { API, showError, isMobile, showSuccess } from '../../helpers';
import { StatusContext } from '../../context/Status';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/Theme';
import { IconPlay, IconFile, IconChevronRight, IconUserGroup, IconPhone, IconLink, IconChevronDown, IconBolt, IconCoinMoneyStroked, IconComponent, IconShield, IconApps, IconCustomerSupport, IconUser, IconCreditCard, IconList, IconSetting, IconTick, IconMail, IconGithubLogo, IconComment, IconHelpCircle } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import { OpenAI, Claude, Gemini, DeepSeek, Qwen, XAI, Zhipu, Wenxin, Qingyan } from '@lobehub/icons';

const { Text } = Typography;

// 优化的打字机动画Hook - 使用ref避免重新渲染
const useTypewriter = (texts, speed = 100, delay = 2000) => {
  const textRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!texts || texts.length === 0 || !textRef.current) return;

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId;

    const updateText = () => {
      if (!textRef.current) return;

      const currentText = texts[currentTextIndex];

      if (!isDeleting) {
        // 正在打字
        if (currentCharIndex < currentText.length) {
          textRef.current.textContent = currentText.slice(0, currentCharIndex + 1);
          currentCharIndex++;
          timeoutId = setTimeout(updateText, speed);
        } else {
          // 当前文本打完，等待一段时间后开始删除
          textRef.current.textContent = currentText;
          timeoutId = setTimeout(() => {
            isDeleting = true;
            updateText();
          }, delay);
        }
      } else {
        // 正在删除
        if (currentCharIndex > 0) {
          currentCharIndex--;
          textRef.current.textContent = currentText.slice(0, currentCharIndex);
          timeoutId = setTimeout(updateText, speed / 2);
        } else {
          // 删除完毕，切换到下一个文本
          isDeleting = false;
          currentTextIndex = (currentTextIndex + 1) % texts.length;
          textRef.current.textContent = '';
          timeoutId = setTimeout(updateText, 200);
        }
      }
    };

    // 开始动画
    updateText();
    setIsInitialized(true);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [texts, speed, delay]);

  return { textRef, isInitialized };
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const theme = useTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const isChinese = i18n.language.startsWith('zh');

  // 打字机动画文本
  const typewriterTexts = [
    '2025，大模型之年，启航AI，您的不二之选',
    '我们致力于提供聚合大模型API，为用户提供稳定、好用的解决方案。'
  ];
  const { textRef, isInitialized } = useTypewriter(typewriterTexts, 80, 3000);

  const displayHomePageContent = async () => {
    setHomePageContent(localStorage.getItem('home_page_content') || '');
    const res = await API.get('/api/home_page_content');
    const { success, message, data } = res.data;
    if (success) {
      setHomePageContent(data);
      localStorage.setItem('home_page_content', data);
    } else {
      showError(message);
      setHomePageContent('');
    }
    setHomePageContentLoaded(true);
  };

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate !== today) {
        try {
          const res = await API.get('/api/notice');
          const { success, data } = res.data;
          if (success && data && data.trim() !== '') {
            setNoticeVisible(true);
          }
        } catch (error) {
          console.error('获取公告失败:', error);
        }
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    displayHomePageContent().then();
  }, []);

  // Hero区域组件
  const HeroSection = () => (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* 背景模糊球 */}
      <div className="blur-ball blur-ball-indigo" />
      <div className="blur-ball blur-ball-teal" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center translate-y-[-5%]">
        {/* 左侧内容 */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-8xl font-semibold mb-6 sm:mb-8 leading-relaxed " style={{ color: '#0059F9' }}>
            启航 AI
          </h1>

          <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 text-semi-color-text-1 leading-relaxed">
            助你低成本探索AIGC的无限可能
          </h2>

          {/* 打字机动画文本 */}
          <div className="mb-2 sm:mb-4 w-full">
            <div className="min-h-[4rem] sm:min-h-[4.5rem] lg:min-h-[5rem] flex items-center justify-center lg:justify-start w-full">
              <div className="typewriter-text-container">
                <Text className="sm:text-xl lg:text-1.5xl text-semi-color-text-2 font-medium">
                  <span ref={textRef} className="typewriter-text"></span>
                </Text>
              </div>
            </div>
          </div>

          {/* CTA按钮组 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/console">
              <Button
                size={isMobile() ? "default" : "large"}
                icon={<IconPlay />}
                className="!rounded-full !px-6 sm:!px-8 !py-2 sm:!py-3 !text-base sm:!text-lg !font-medium w-full sm:w-auto !bg-blue-600 !text-white !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
                style={{
                  backgroundColor: '#0059F9',
                  borderColor: '#0059F9',
                  color: 'white'
                }}
              >
                立即开始
              </Button>
            </Link>
            {docsLink && (
              <Button
                size={isMobile() ? "default" : "large"}
                icon={<IconFile />}
                className="!rounded-full !px-6 sm:!px-8 !py-2 sm:!py-3 !text-base sm:!text-lg !font-medium w-full sm:w-auto"
                onClick={() => window.open(docsLink, '_blank')}
              >
                查看文档
              </Button>
            )}
          </div>
        </div>

        {/* 右侧Logo */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <img
            src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png"
            alt="启航AI Logo"
            className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 xl:w-[28rem] xl:h-[28rem] object-contain"
          />
        </div>
      </div>

      {/* 向下滚动按钮 */}
      <div className="absolute bottom-8 left-1/2 scroll-down-container">
        <Button
          icon={<IconChevronDown size="large" />}
          shape="circle"
          size="medium"
          className="scroll-down-button !bg-white/80 !border-semi-color-border !shadow-lg"
          onClick={() => {
            const modelsSection = document.querySelector('#models-section');
            if (modelsSection) {
              modelsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        />
      </div>
    </section>
  );

  // 模型适配区域组件
  const ModelsSection = () => {
    const models = [
      { name: 'OpenAI', icon: <OpenAI size={32} />, url: 'https://openai.com' },
      { name: 'Claude', icon: <Claude.Color size={32} />, url: 'https://openai.com' },
      { name: 'Gemini', icon: <Gemini.Color size={32} />, url: 'https://openai.com' },
      { name: 'DeepSeek', icon: <DeepSeek.Color size={32} />, url: 'https://openai.com' },
      { name: 'Qwen', icon: <Qwen.Color size={32} />, url: 'https://openai.com' },
      { name: 'XAI', icon: <XAI size={32} />, url: 'https://openai.com' },
      { name: 'Zhipu', icon: <Zhipu.Color size={32} />, url: 'https://openai.com' },
      { name: 'Wenxin', icon: <Wenxin.Color size={32} />, url: 'https://openai.com' },
      { name: 'Qingyan', icon: <Qingyan.Color size={32} />, url: 'https://openai.com' },
      { name: '语音识别', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="ASR" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: '文本转语音', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="TTS" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: '启航绘图 V1', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="绘图V1" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: '启航绘图 V2', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="绘图V2" className="w-8 h-8" />, url: 'https://openai.com' }
    ];

    return (
      <section id="models-section" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-semi-color-text-0">
              适配众多 AI 大模型
            </h2>
            <Text className="sm:text-xl text-semi-color-text-1 max-w-4xl mx-auto !text-semi-color-text-2">
              覆盖全网各种主流模型，同时提供 ASR（语音识别）、TTS（文本转语音）、绘图等启航特供模型，覆盖 90%+ 的场景
            </Text>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {models.map((model, index) => (
              <Card
                key={index}
                className="!p-3 sm:!p-4 !rounded-2xl hover:!shadow-lg transition-all duration-300 cursor-pointer group hover:!scale-105"
                onClick={() => window.open(model.url, '_blank')}
                style={{ borderRadius: '16px' }}
              >
                <div className="flex items-center justify-between h-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="flex-shrink-0">
                      {model.icon}
                    </div>
                    <Text className="font-medium text-semi-color-text-0 group-hover:text-semi-color-primary text-sm sm:text-base truncate">
                      {model.name}
                    </Text>
                  </div>
                  <IconChevronRight className="text-semi-color-text-2 group-hover:text-semi-color-primary transition-colors flex-shrink-0 ml-2" size="large" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // 应用适配区域组件
  const ApplicationsSection = () => {
    const applications = [
      { name: 'NextWeb', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="NextWeb" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: 'ChatBox', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="ChatBox" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: 'CherryStudio', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="CherryStudio" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: 'LobeChat', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="LobeChat" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: '沉浸式翻译', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="沉浸式翻译" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: 'LangBot', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="LangBot" className="w-8 h-8" />, url: 'https://openai.com' },
      { name: 'GoAmzAI', icon: <img src="https://img.thelazy.top/AIGC-Station/QHAPI-Logo.png" alt="GoAmzAI" className="w-8 h-8" />, url: 'https://openai.com' }
    ];

    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-semi-color-text-0">
              一键接入众多应用
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1 max-w-4xl mx-auto !text-semi-color-text-2">
              支持任何适配 OpenAI 标准的应用，聊天、翻译、生产力等各种应用，一键接入，快速实现"启航+X"
            </Text>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {applications.map((app, index) => (
              <Card
                key={index}
                className="!p-3 sm:!p-4 !rounded-2xl hover:!shadow-lg transition-all duration-300 cursor-pointer group hover:!scale-105"
                onClick={() => window.open(app.url, '_blank')}
                style={{ borderRadius: '16px' }}
              >
                <div className="flex items-center justify-between h-4">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <div className="flex-shrink-0">
                      {app.icon}
                    </div>
                    <Text className="font-medium text-semi-color-text-0 group-hover:text-semi-color-primary text-sm sm:text-base truncate">
                      {app.name}
                    </Text>
                  </div>
                  <IconChevronRight className="text-semi-color-text-2 group-hover:text-semi-color-primary transition-colors flex-shrink-0 ml-2" size="large" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // 优势展示区域组件
  const AdvantagesSection = () => {
    const isDark = theme === 'dark';

    const advantages = [
      {
        title: '稳定快速',
        description: '采用 CN2 GIA 高速线路，确保线路稳定可靠',
        icon: <IconBolt size="extra-large" />,
        color: '#10B981'
      },
      {
        title: '低价成本',
        description: '相对于市面的费率，我们的价格至少优惠30%及以上，帮助您节省成本',
        icon: <IconCoinMoneyStroked size="extra-large" />,
        color: '#F59E0B'
      },
      {
        title: '高效集成',
        description: '提供完整的文档和SDK，支持快速和便捷地对接开发',
        icon: <IconComponent size="extra-large" />,
        color: '#3B82F6'
      },
      {
        title: '安全保障',
        description: '采用多层安全措施，包括身份验证、数据加密和访问控制',
        icon: <IconShield size="extra-large" />,
        color: '#EF4444'
      },
      {
        title: '超多模型',
        description: '提供文本聊天、语音识别、语音生成、绘图等多种模型',
        icon: <IconApps size="extra-large" />,
        color: '#8B5CF6'
      },
      {
        title: '技术支持',
        description: '提供全天候的技术支持，快速解决问题，减少停机时间',
        icon: <IconCustomerSupport size="extra-large" />,
        color: '#06B6D4'
      }
    ];

    // 根据主题动态生成卡片样式
    const getCardStyle = () => {
      if (isDark) {
        return {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)'
        };
      } else {
        return {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        };
      }
    };

    // 根据主题动态生成图标容器样式
    const getIconContainerStyle = (color) => {
      if (isDark) {
        return {
          background: `linear-gradient(135deg, ${color}25 0%, ${color}15 100%)`,
          border: `2px solid ${color}40`
        };
      } else {
        return {
          background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
          border: `2px solid ${color}30`
        };
      }
    };

    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-semi-color-text-0">
              我们的优势
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1 max-w-3xl mx-auto">
              专业的技术团队，为您提供稳定、安全、高效的AI服务体验
            </Text>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {advantages.map((advantage, index) => (
              <Card
                key={index}
                className="!p-6 sm:!p-8 text-center hover:!shadow-xl hover:!scale-105 transition-all duration-300 !rounded-2xl !border-0 group cursor-pointer"
                style={getCardStyle()}
              >
                {/* 图标容器 */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={getIconContainerStyle(advantage.color)}
                >
                  <div style={{ color: advantage.color }}>
                    {advantage.icon}
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-semi-color-text-0 group-hover:text-semi-color-primary transition-colors duration-300">
                  {advantage.title}
                </h3>

                {/* 描述 */}
                <Text className="text-semi-color-text-1 leading-relaxed text-sm sm:text-base">
                  {advantage.description}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // 接入步骤区域组件
  const StepsSection = () => {
    const steps = [
      {
        step: 1,
        title: '注册账户',
        description: '创建您的启航AI账户，开启AI之旅的第一步',
        icon: <IconUser size="extra-large" />,
        url: 'https://api.qhaigc.net/register',
        color: '#3B82F6'
      },
      {
        step: 2,
        title: '第一笔充值',
        description: '为您的账户充值以开始使用，支持多种支付方式',
        icon: <IconCreditCard size="extra-large" />,
        url: 'https://api.qhaigc.net/console/topup',
        color: '#10B981'
      },
      {
        step: 3,
        title: '选择模型',
        description: '查看定价并选择适合您需求的AI模型',
        icon: <IconList size="extra-large" />,
        url: 'https://www.galaapi.com/pricing',
        color: '#F59E0B'
      },
      {
        step: 4,
        title: '接入应用',
        description: '配置您的应用，使用我们提供的API接口',
        icon: <IconSetting size="extra-large" />,
        url: null,
        color: '#8B5CF6',
        baseUrl: 'https://api.qhaigc.net'
      },
      {
        step: 5,
        title: '大功告成',
        description: '开始享受稳定高效的AI服务，探索无限可能',
        icon: <IconTick size="extra-large" />,
        url: null,
        color: '#EF4444'
      }
    ];

    const copyToClipboard = (text, buttonElement) => {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess('BaseURL已复制到剪贴板');
        // 添加成功动画效果
        if (buttonElement) {
          buttonElement.classList.add('copy-button-success');
          setTimeout(() => {
            buttonElement.classList.remove('copy-button-success');
          }, 1000);
        }
      }).catch(() => {
        showError('复制失败，请手动复制');
      });
    };

    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-semi-color-text-0">
              接入步骤
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1">
              简单几步，快速接入启航AI服务
            </Text>
          </div>

          <div className="relative">
            {/* 垂直连接线 */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 timeline-line"></div>

            <div className="space-y-6 sm:space-y-8">
              {steps.map((stepItem, index) => (
                <div key={index} className="relative flex items-center group step-card">
                  {/* 步骤图标容器 */}
                  <div className="relative z-10 flex-shrink-0">
                    {/* 背景圆圈遮挡竖线 */}
                    <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full icon-background-circle -m-1"></div>
                    <div
                      className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${stepItem.color}20 0%, ${stepItem.color}10 100%)`,
                        border: `2px solid ${stepItem.color}30`
                      }}
                    >
                      <div style={{ color: stepItem.color }}>
                        {React.cloneElement(stepItem.icon, { size: 'large' })}
                      </div>
                    </div>
                    {/* 步骤编号徽章 */}
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
                      style={{ backgroundColor: stepItem.color }}
                    >
                      {stepItem.step}
                    </div>
                  </div>

                  {/* 步骤内容卡片 */}
                  <div className="ml-4 sm:ml-6 flex-1">
                    <Card
                      className="!p-4 sm:!p-6 !rounded-xl hover:!shadow-lg transition-all duration-300 group-hover:!scale-[1.01] !border-0 step-timeline-card"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="text-lg sm:text-xl font-bold mb-2 text-semi-color-text-0 group-hover:text-semi-color-primary transition-colors duration-300">
                            {stepItem.title}
                          </h3>
                          <Text className="text-semi-color-text-1 leading-relaxed text-sm sm:text-base">
                            {stepItem.description}
                          </Text>

                          {/* BaseURL 特殊处理 */}
                          {stepItem.baseUrl && (
                            <div className="mt-3 p-3 bg-semi-color-bg-2 rounded-lg border border-semi-color-border">
                              <Text className="text-xs text-semi-color-text-2 mb-2">BaseURL:</Text>

                              {/* 第一个 BaseURL */}
                              <div className="flex items-center justify-between mb-2 p-2 baseurl-input-box rounded border border-dashed">
                                <Text className="font-mono text-semi-color-text-1 text-xs sm:text-sm flex-1 mr-2">
                                  {stepItem.baseUrl}
                                </Text>
                                <Button
                                  size="small"
                                  icon={<IconLink />}
                                  onClick={(e) => copyToClipboard(stepItem.baseUrl, e.target.closest('button'))}
                                  className="!rounded-full !px-2 !py-1 !text-xs hover:!scale-105 transition-transform duration-200"
                                >
                                  复制
                                </Button>
                              </div>

                              {/* 第二个 BaseURL */}
                              <div className="flex items-center justify-between mb-2 p-2 baseurl-input-box rounded border border-dashed">
                                <Text className="font-mono text-semi-color-text-1 text-xs sm:text-sm flex-1 mr-2">
                                  {stepItem.baseUrl}/v1
                                </Text>
                                <Button
                                  size="small"
                                  icon={<IconLink />}
                                  onClick={(e) => copyToClipboard(`${stepItem.baseUrl}/v1`, e.target.closest('button'))}
                                  className="!rounded-full !px-2 !py-1 !text-xs hover:!scale-105 transition-transform duration-200"
                                >
                                  复制
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 操作按钮 */}
                        {stepItem.url && (
                          <div className="flex-shrink-0 sm:ml-4">
                            <Button
                              size="default"
                              icon={<IconChevronRight />}
                              onClick={() => window.open(stepItem.url, '_blank')}
                              className="!rounded-full !px-4 !py-2 !text-sm !font-medium hover:!scale-105 transition-transform duration-200"
                              style={{
                                backgroundColor: stepItem.color,
                                borderColor: stepItem.color,
                                color: 'white'
                              }}
                            >
                              前往
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // 联系我们区域组件
  const ContactSection = () => {
    const isDark = theme === 'dark';

    const contactInfo = {
      title: '官方 QQ 群',
      groupNumber: '712747875',
      description: '加群后直接私聊群主',
      action: () => window.open('https://qm.qq.com/q/nICQZrwRhY', '_blank')
    };

    // 根据主题动态生成卡片样式
    const getCardStyle = () => {
      if (isDark) {
        return {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(24, 144, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(24, 144, 255, 0.1)'
        };
      } else {
        return {
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(24, 144, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(24, 144, 255, 0.08)'
        };
      }
    };

    // 复制群号到剪贴板
    const copyGroupNumber = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(contactInfo.groupNumber).then(() => {
        showSuccess('群号已复制到剪贴板');
      }).catch(() => {
        showError('复制失败，请手动复制');
      });
    };

    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-semi-color-text-0">
              联系我们
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1 max-w-2xl mx-auto">
              遇到问题或需要技术支持？我们的专业团队随时为您提供帮助
            </Text>
          </div>

          {/* 主要联系卡片 - 左右布局 */}
          <div className="flex justify-center">
            <Card
              className="!p-6 sm:!p-8 hover:!shadow-2xl hover:!scale-105 transition-all duration-300 !rounded-2xl group max-w-2xl w-full"
              style={getCardStyle()}
            >
              <div className="flex items-center space-x-6 sm:space-x-8">
                {/* 左侧图标 */}
                <div className="flex-shrink-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #1890FF20 0%, #1890FF10 100%)',
                      border: '2px solid #1890FF30'
                    }}
                  >
                    <IconUserGroup size="extra-large" style={{ color: '#1890FF' }} />
                  </div>
                </div>

                {/* 中间内容 */}
                <div className="flex-1 min-w-0 border-l border-semi-color-border pl-6 pr-6 sm:pl-8 sm:pr-8">
                  {/* 标题 */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-semi-color-text-0">
                    {contactInfo.title}
                  </h3>

                  {/* 群号 - 可点击复制 */}
                  <div className="mb-3">
                    <Text className="text-xs text-semi-color-text-2 mb-1">群号</Text>
                    <div
                      className="inline-block cursor-pointer hover:bg-semi-color-bg-2 px-2 py-1 rounded transition-colors duration-200"
                      onClick={copyGroupNumber}
                      title="点击复制群号"
                    >
                      <Text className="text-xl sm:text-2xl font-bold text-semi-color-primary font-mono hover:text-semi-color-primary-hover">
                        {contactInfo.groupNumber}
                      </Text>
                    </div>
                  </div>

                  {/* 描述文本 */}
                  <Text className="text-sm sm:text-base text-semi-color-text-1 leading-relaxed">
                    {contactInfo.description}
                  </Text>
                </div>

                {/* 右侧按钮 */}
                <div className="flex-shrink-0">
                  <Button
                    size="large"
                    onClick={() => window.open('https://qm.qq.com/q/nICQZrwRhY', '_blank')}
                    className="!rounded-xl !px-4 !py-3 !text-sm !font-medium hover:!scale-105 transition-transform duration-200"
                    style={{
                      backgroundColor: '#1890FF',
                      borderColor: '#1890FF',
                      color: 'white',
                      minWidth: '80px',
                      height: '60px'
                    }}
                  >
                    <div className="flex flex-col items-center leading-tight">
                      <span>立即</span>
                      <span>加入</span>
                    </div>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="w-full overflow-x-hidden">
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
        isMobile={isMobile()}
      />
      {homePageContentLoaded && homePageContent === '' ? (
        <div className="w-full overflow-x-hidden">
          <HeroSection />
          <ModelsSection />
          <ApplicationsSection />
          <AdvantagesSection />
          <StepsSection />
          <ContactSection />
        </div>
      ) : (
        <div className="overflow-x-hidden w-full">
          {homePageContent.startsWith('https://') ? (
            <iframe src={homePageContent} className="w-full h-screen border-none" />
          ) : (
            <div className="mt-[64px]" dangerouslySetInnerHTML={{ __html: homePageContent }} />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

