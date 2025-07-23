import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Typography, Card, Space } from '@douyinfe/semi-ui';
import { API, showError, isMobile, showSuccess, getServerAddress, getLogo, getSystemName } from '../../helpers';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Typography, Tag, Input, ScrollList, ScrollItem } from '@douyinfe/semi-ui';
import { API, showError, copy, showSuccess } from '../../helpers';
import { useIsMobile } from '../../hooks/useIsMobile.js';
import { API_ENDPOINTS } from '../../constants/common.constant';
import { StatusContext } from '../../context/Status';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/Theme';
import { IconPlay, IconFile, IconChevronRight, IconUserGroup, IconPhone, IconChevronDown, IconBolt, IconCoinMoneyStroked, IconComponent, IconShield, IconApps, IconCustomerSupport, IconUser, IconCreditCard, IconList, IconSetting, IconTick, IconMail, IconGithubLogo, IconComment, IconHelpCircle, IconCopy } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import NoticeModal from '../../components/layout/NoticeModal';
import { OpenAI, Claude, Gemini, DeepSeek, Qwen, XAI, Zhipu, Wenxin, Qingyan } from '@lobehub/icons';


const { Text } = Typography;
const systemName = getSystemName();  //获取系统名称，默认为“启航 AI”
const logo = getLogo();  //获取 Logo，默认为 /logo.png

// 优化的打字机动画Hook - 使用ref避免重新渲染
const useTypewriter = (texts, speed = 100, delay = 2000) => {
  const textRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { i18n } = useTranslation();

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
        if (currentCharIndex < currentText.length) {
          textRef.current.textContent = currentText.slice(0, currentCharIndex + 1);
          currentCharIndex++;
          timeoutId = setTimeout(updateText, speed);
        } else {
          textRef.current.textContent = currentText;
          timeoutId = setTimeout(() => {
            isDeleting = true;
            updateText();
          }, delay);
        }
      } else {
        if (currentCharIndex > 0) {
          currentCharIndex--;
          textRef.current.textContent = currentText.slice(0, currentCharIndex);
          timeoutId = setTimeout(updateText, speed / 2);
        } else {
          isDeleting = false;
          currentTextIndex = (currentTextIndex + 1) % texts.length;
          textRef.current.textContent = '';
          timeoutId = setTimeout(updateText, 200);
        }
      }
    };

    updateText();
    setIsInitialized(true);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [texts, speed, delay, i18n.language]);

  return { textRef, isInitialized };
};

const Home = () => {
  const { t, i18n } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const theme = useTheme();
  const [homePageContentLoaded, setHomePageContentLoaded] = useState(false);
  const [homePageContent, setHomePageContent] = useState('');
  const [noticeVisible, setNoticeVisible] = useState(false);
  const isMobile = useIsMobile();
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;
  const docsLink = statusState?.status?.docs_link || '';
  const isChinese = i18n.language.startsWith('zh');

  // 打字机动画文本（国际化）
  const typewriterTexts = [
    t('2025，大模型之年，{{systemName}}，您的不二之选', { systemName }),
    t('我们致力于提供聚合大模型API，为用户提供稳定、好用的解决方案。')
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
          <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-8xl font-semibold mb-6 sm:mb-8 leading-relaxed" style={{ color: '#0059F9' }}>
            {systemName}
          </h1>
          <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-normal mb-6 sm:mb-8 text-semi-color-text-1 leading-relaxed">
            {t('助你低成本探索AIGC的无限可能')}
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
                {t('立即开始')}
              </Button>
            </Link>
            {docsLink && (
              <Button
                size={isMobile() ? "default" : "large"}
                icon={<IconFile />}
                className="!rounded-full !px-6 sm:!px-8 !py-2 sm:!py-3 !text-base sm:!text-lg !font-medium w-full sm:w-auto"
                onClick={() => window.open(docsLink, '_blank')}
              >
                {t('查看文档')}
              </Button>
            )}
          </div>
        </div>
        {/* 右侧Logo */}
        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
          <img
            src={logo}
            alt={t('{{systemName}} Logo', { systemName })}
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
      { name: 'OpenAI', icon: <OpenAI size={32} />, url: 'https://openai.com ' },
      { name: t('Claude'), icon: <Claude.Color size={32} />, url: 'https://claude.ai ' },
      { name: t('Gemini'), icon: <Gemini.Color size={32} />, url: 'https://gemini.google.com ' },
      { name: t('DeepSeek'), icon: <DeepSeek.Color size={32} />, url: 'https://deepseek.com ' },
      { name: t('通义千问'), icon: <Qwen.Color size={32} />, url: 'https://qwenlm.github.io ' },
      { name: t('XAI'), icon: <XAI size={32} />, url: 'https://x.ai ' },
      { name: t('智谱清言'), icon: <Zhipu.Color size={32} />, url: 'https://www.zhipuai.cn ' },
      { name: t('文心一言'), icon: <Wenxin.Color size={32} />, url: 'https://wenxin.baidu.com ' },
      { name: t('语音转文本'), icon: <img src="https://img.thelazy.top/2025/04/09/qhai-asr.png " alt="ASR" className="w-8 h-8" />, url: 'https://api.qhaigc.net/pricing ' },
      { name: t('文本转语音'), icon: <img src="https://img.thelazy.top/2025/04/08/voice.png " alt="TTS" className="w-8 h-8" />, url: 'https://api.qhaigc.net/pricing ' },
      { name: t('启航绘图 V1'), icon: <img src="https://img.thelazy.top/2025/04/10/ai-draw.png " alt="启航绘图V1" className="w-8 h-8" />, url: 'https://api.qhaigc.net/pricing ' },
      { name: t('启航绘图 V2'), icon: <img src="https://img.thelazy.top/2025/04/10/ai-draw.png" alt="启航绘图V2" className="w-8 h-8" />, url: 'https://api.qhaigc.net/pricing ' }
    ];
    return (
      <section id="models-section" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-semi-color-text-0">
              {t('适配众多 AI 大模型')}
            </h2>
            <Text className="sm:text-xl text-semi-color-text-1 max-w-4xl mx-auto !text-semi-color-text-2">
              {t('覆盖全网各种主流模型，同时提供 ASR（语音识别）、TTS（文本转语音）、绘图等特供模型，覆盖 90%+ 的场景')}
            </Text>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
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
                      {t(model.name)}
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
      {
        name: 'LangBot',
        icon: <img src="https://img.thelazy.top/2025/07/19/langbot-logo-20250719015647029.png " alt="LangBot" className="w-8 h-8 rounded-md" />,
        url: 'https://github.com/langbot-app/LangBot ',
        description: '简单易用的大模型即时通信机器人开发平台'
      },
      {
        name: 'NextWeb',
        icon: <img src="https://img.thelazy.top/2025/07/19/153288546.png " alt="NextWeb" className="w-8 h-8 rounded-md" />,
        url: 'https://github.com/ChatGPTNextWeb/NextChat ',
        description: '一个易于使用且功能强大的开源 ChatGPT Web 界面，支持多模型、多角色、语音交互等特性，适用于个人和企业用户。'
      },
      {
        name: 'ChatBox',
        icon: <img src="https://img.thelazy.top/2025/07/19/icon.png " alt="ChatBox" className="w-8 h-8 rounded-md" />,
        url: 'https://github.com/chatboxai/chatbox ',
        description: '一个开源的 AI 聊天客户端，支持本地模型运行，注重隐私保护，适用于 macOS、Windows 和 Linux。'
      },
      {
        name: 'CherryStudio',
        icon: <img src="https://img.thelazy.top/2025/07/19/187777663.png " alt="CherryStudio" className="w-8 h-8 rounded-md" />,
        url: 'https://github.com/CherryHQ/cherry-studio ',
        description: 'CherryStudio 是一个用于构建 AI 助手和聊天机器人的可视化开发平台，支持自定义模型和插件扩展。'
      },
      {
        name: 'LobeChat',
        icon: <img src="https://img.thelazy.top/2025/07/19/logo-3d.webp " alt="LobeChat" className="w-8 h-8 rounded-md" />,
        url: 'https://github.com/lobehub/lobe-chat ',
        description: 'LobeChat 是一个可扩展的开源 AI 聊天客户端，支持多种大模型，提供美观的用户界面和丰富的功能插件。'
      },
      {
        name: t('沉浸式翻译'),
        icon: <img src="https://img.thelazy.top/2025/07/19/logo.png " alt="沉浸式翻译" className="w-8 h-8 rounded-md" />,
        url: 'https://immersivetranslate.com ',
        description: '沉浸式翻译是一款浏览器扩展，提供网页内容的实时翻译，支持多种语言和 AI 模型，提升多语言浏览体验。'
      }
    ];
    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-semi-color-text-0">
              {t('一键接入众多应用')}
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1 max-w-4xl mx-auto !text-semi-color-text-2">
              {t('支持任何适配 OpenAI 标准的应用，聊天、翻译、生产力等各种应用，一键接入，快速实现')}"{systemName} + X"
            </Text>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {applications.map((app, index) => (
              <Card
                key={index}
                className="!p-4 sm:!p-5 !rounded-2xl hover:!shadow-lg transition-all duration-300 cursor-pointer group hover:!scale-105"
                onClick={() => window.open(app.url, '_blank')}
                style={{ borderRadius: '16px', minHeight: '120px' }}
              >
                <div className="flex flex-col h-full">
                  {/* 顶部：图标和名称 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <div className="flex-shrink-0">
                        {app.icon}
                      </div>
                      <Text className="font-medium text-semi-color-text-0 group-hover:text-semi-color-primary text-sm sm:text-base truncate">
                        {t(app.name)}
                      </Text>
                    </div>
                    <IconChevronRight className="text-semi-color-text-2 group-hover:text-semi-color-primary transition-colors flex-shrink-0 ml-2" size="large" />
                  </div>
                  {/* 底部：描述文本 */}
                  <div className="flex-1 flex items-end">
                    <Text className="text-xs sm:text-sm text-semi-color-text-2 leading-relaxed">
                      {t(app.description)}
                    </Text>
                  </div>
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
        description: t('采用 CN2 GIA 高速线路，确保线路稳定可靠'),
        icon: <IconBolt size="extra-large" />,
        color: '#10B981'
      },
      {
        title: '低价成本',
        description: t('相对于市面的费率，我们的价格至少优惠30%及以上，帮助您节省成本'),
        icon: <IconCoinMoneyStroked size="extra-large" />,
        color: '#F59E0B'
      },
      {
        title: '高效集成',
        description: t('提供完整的文档和SDK，支持快速和便捷地对接开发'),
        icon: <IconComponent size="extra-large" />,
        color: '#3B82F6'
      },
      {
        title: '安全保障',
        description: t('采用多层安全措施，包括身份验证、数据加密和访问控制'),
        icon: <IconShield size="extra-large" />,
        color: '#EF4444'
      },
      {
        title: '超多模型',
        description: t('提供文本聊天、语音识别、语音生成、绘图等多种模型'),
        icon: <IconApps size="extra-large" />,
        color: '#8B5CF6'
      },
      {
        title: '技术支持',
        description: t('提供全天候的技术支持，快速解决问题，减少停机时间'),
        icon: <IconCustomerSupport size="extra-large" />,
        color: '#06B6D4'
      }
    ];

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
              {t('我们的优势')}
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1 max-w-3xl mx-auto">
              {t('专业的技术团队，为您提供稳定、安全、高效的AI服务体验')}
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
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={getIconContainerStyle(advantage.color)}
                >
                  <div style={{ color: advantage.color }}>
                    {advantage.icon}
                  </div>
                </div>
                {/* 标题 */}
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-semi-color-text-0 group-hover:text-semi-color-primary transition-colors duration-300">
                  {t(advantage.title)}
                </h3>
                {/* 描述 */}
                <Text className="text-semi-color-text-1 leading-relaxed text-sm sm:text-base">
                  {t(advantage.description)}
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
        title: t('注册账户'),
        description: t('创建您的账户，开启AI之旅的第一步'),
        icon: <IconUser size="extra-large" />,
        url: `${getServerAddress()}/register`,
        color: '#3B82F6'
      },
      {
        step: 2,
        title: t('第一笔充值'),
        description: t('为您的账户充值以开始使用，支持多种支付方式'),
        icon: <IconCreditCard size="extra-large" />,
        url: `${getServerAddress()}/console/topup`,
        color: '#10B981'
      },
      {
        step: 3,
        title: t('选择模型'),
        description: t('查看定价并选择适合您需求的AI模型'),
        icon: <IconList size="extra-large" />,
        url: `${getServerAddress()}/pricing`,
        color: '#F59E0B'
      },
      {
        step: 4,
        title: t('接入应用'),
        description: t('配置您的应用，使用我们提供的API接口'),
        icon: <IconSetting size="extra-large" />,
        url: null,
        color: '#8B5CF6',
        baseUrl: getServerAddress()
      },
      {
        step: 5,
        title: t('大功告成'),
        description: t('开始享受稳定高效的AI服务，探索无限可能'),
        icon: <IconTick size="extra-large" />,
        url: null,
        color: '#EF4444'
      }
    ];

    const copyToClipboard = (text, buttonElement) => {
      navigator.clipboard.writeText(text).then(() => {
        showSuccess(t('BaseURL已复制到剪贴板'));
        if (buttonElement) {
          buttonElement.classList.add('copy-button-success');
          setTimeout(() => {
            buttonElement.classList.remove('copy-button-success');
          }, 1000);
        }
      }).catch(() => {
        showError(t('复制失败，请手动复制'));
      });
    };

    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-semi-color-text-0">
              {t('接入步骤')}
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1">
              {t('简单几步，快速接入')} {systemName} {t('服务')}
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
                            {t(stepItem.title)}
                          </h3>
                          <Text className="text-semi-color-text-1 leading-relaxed text-sm sm:text-base">
                            {t(stepItem.description)}
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
                                  icon={<IconCopy />}
                                  onClick={(e) => copyToClipboard(stepItem.baseUrl, e.target.closest('button'))}
                                  className="!rounded-full !px-2 !py-1 !text-xs hover:!scale-105 transition-transform duration-200"
                                >
                                  {t('复制')}
                                </Button>
                              </div>
                              {/* 第二个 BaseURL */}
                              <div className="flex items-center justify-between mb-2 p-2 baseurl-input-box rounded border border-dashed">
                                <Text className="font-mono text-semi-color-text-1 text-xs sm:text-sm flex-1 mr-2">
                                  {stepItem.baseUrl}/v1
                                </Text>
                                <Button
                                  size="small"
                                  icon={<IconCopy />}
                                  onClick={(e) => copyToClipboard(`${stepItem.baseUrl}/v1`, e.target.closest('button'))}
                                  className="!rounded-full !px-2 !py-1 !text-xs hover:!scale-105 transition-transform duration-200"
                                >
                                  {t('复制')}
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
                              {t('前往')}
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
      subtitle: '加群后直接私聊群主即可'
    };

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

    const copyGroupNumber = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(contactInfo.groupNumber).then(() => {
        showSuccess(t('群号已复制到剪贴板'));
      }).catch(() => {
        showError(t('复制失败，请手动复制'));
      });
    };

    return (
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-semi-color-bg-1 border-t border-semi-color-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-semi-color-text-0">
              {t('联系我们')}
            </h2>
            <Text className="text-lg sm:text-xl text-semi-color-text-1 max-w-2xl mx-auto">
              {t('遇到问题或需要技术支持？我们的专业团队随时为您提供帮助')}
            </Text>
          </div>
          {/* 主要联系卡片 - 左右布局 */}
          <div className="flex justify-center">
            <Card
              className="!p-4 sm:!p-6 hover:!shadow-2xl hover:!scale-105 transition-all duration-300 !rounded-2xl group max-w-lg w-full"
              style={getCardStyle()}
            >
              <div className="flex items-center space-x-8 sm:space-x-10">
                {/* 左侧图标 */}
                <div className="flex-shrink-0">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #1890FF20 0%, #1890FF10 100%)',
                      border: '2px solid #1890FF30'
                    }}
                  >
                    <IconUserGroup size="large" style={{ color: '#1890FF' }} />
                  </div>
                </div>
                {/* 右侧内容 */}
                <div className="flex-1 min-w-0">
                  {/* 主标题 */}
                  <h3 className="text-lg sm:text-xl font-bold mb-1 text-semi-color-text-0">
                    {t(contactInfo.title)}
                  </h3>
                  {/* 副标题 */}
                  <Text className="text-xs sm:text-sm text-semi-color-text-1 mb-3 leading-relaxed">
                    {t(contactInfo.subtitle)}
                  </Text>
                  {/* 群号显示 - 可点击复制，带复制图标 */}
                  <div className="flex items-center">
                    <div
                      className="inline-flex items-center space-x-2 cursor-pointer hover:bg-semi-color-bg-2 px-2 py-1 rounded-md transition-all duration-200 group/copy border border-dashed border-semi-color-border hover:border-semi-color-primary"
                      onClick={copyGroupNumber}
                      title={t('点击复制群号')}
                    >
                      <Text className="text-base sm:text-lg font-bold text-semi-color-primary font-mono group-hover/copy:text-semi-color-primary-hover transition-colors duration-200">
                        {contactInfo.groupNumber}
                      </Text>
                      <IconCopy
                        size="small"
                        className="text-semi-color-text-2 group-hover/copy:text-semi-color-primary transition-colors duration-200"
                      />
                    </div>
                  </div>
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