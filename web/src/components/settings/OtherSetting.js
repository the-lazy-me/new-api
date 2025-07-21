import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Banner,
  Button,
  Col,
  Form,
  Row,
  Modal,
  Space,
  Card,
  Tooltip,
} from '@douyinfe/semi-ui';
import { API, showError, showSuccess, timestamp2string } from '../../helpers';
import { marked } from 'marked';
import { useTranslation } from 'react-i18next';
import { StatusContext } from '../../context/Status/index.js';
import Text from '@douyinfe/semi-ui/lib/es/typography/text';

const OtherSetting = () => {
  const { t } = useTranslation();
  let [inputs, setInputs] = useState({
    Notice: '',
    SystemName: '',
    Logo: '',
    Footer: '',
    About: '',
    HomePageContent: '',
    TopUpNotice: '',
    EmailTemplateEnabled: '',
    EmailTemplate_Verification: '',
    EmailTemplate_PasswordReset: '',
    EmailTemplate_QuotaWarning: '',
  });
  let [loading, setLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [statusState, statusDispatch] = useContext(StatusContext);
  const [updateData, setUpdateData] = useState({
    tag_name: '',
    content: '',
  });
  const [templateVariables, setTemplateVariables] = useState({
    '{{username}}': '用户名',
    '{{verification_code}}': '验证码',
    '{{reset_link}}': '重置链接',
    '{{site_name}}': '网站名称',
    '{{valid_minutes}}': '有效时间（分钟）'
  });
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [currentTemplateType, setCurrentTemplateType] = useState('');

  const updateOption = async (key, value) => {
    setLoading(true);
    const res = await API.put('/api/option/', {
      key,
      value,
    });
    const { success, message } = res.data;
    if (success) {
      // 对于邮件模板开关，需要转换为布尔值
      let localValue = value;
      if (key === 'EmailTemplateEnabled') {
        localValue = value === 'true';
      }
      setInputs((inputs) => ({ ...inputs, [key]: localValue }));
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const [loadingInput, setLoadingInput] = useState({
    Notice: false,
    SystemName: false,
    Logo: false,
    HomePageContent: false,
    About: false,
    Footer: false,
    CheckUpdate: false,
    TopUpNotice: false,
    EmailTemplateEnabled: false,
    EmailTemplate_Verification: false,
    EmailTemplate_PasswordReset: false,
    EmailTemplate_QuotaWarning: false,
  });
  const handleInputChange = async (value, e) => {
    const name = e.target.id;
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  // 判断邮件模板是否启用
  const isEmailTemplateEnabled = () => {
    return inputs.EmailTemplateEnabled === true;
  };

  // 通用设置
  const formAPISettingGeneral = useRef();
  // 通用设置 - Notice
  const submitNotice = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Notice: true }));
      await updateOption('Notice', inputs.Notice);
      showSuccess(t('公告已更新'));
    } catch (error) {
      console.error(t('公告更新失败'), error);
      showError(t('公告更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Notice: false }));
    }
  };

  // 通用设置 - TopUpNotice
  const submitTopUpNotice = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, TopUpNotice: true }));
      await updateOption('TopUpNotice', inputs.TopUpNotice);
      showSuccess(t('充值公告已更新'));
    } catch (error) {
      console.error(t('充值公告更新失败'), error);
      showError(t('充值公告更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, TopUpNotice: false }));
    }
  };
  // 个性化设置
  const formAPIPersonalization = useRef();
  // 邮件模板设置
  const formAPIEmailTemplate = useRef();
  //  个性化设置 - SystemName
  const submitSystemName = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        SystemName: true,
      }));
      await updateOption('SystemName', inputs.SystemName);
      showSuccess(t('系统名称已更新'));
    } catch (error) {
      console.error(t('系统名称更新失败'), error);
      showError(t('系统名称更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        SystemName: false,
      }));
    }
  };

  // 个性化设置 - Logo
  const submitLogo = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Logo: true }));
      await updateOption('Logo', inputs.Logo);
      showSuccess('Logo 已更新');
    } catch (error) {
      console.error('Logo 更新失败', error);
      showError('Logo 更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Logo: false }));
    }
  };
  // 个性化设置 - 首页内容
  const submitOption = async (key) => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        HomePageContent: true,
      }));
      await updateOption(key, inputs[key]);
      showSuccess('首页内容已更新');
    } catch (error) {
      console.error('首页内容更新失败', error);
      showError('首页内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        HomePageContent: false,
      }));
    }
  };
  // 个性化设置 - 关于（更新日志）
  const submitAbout = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, About: true }));
      await updateOption('About', inputs.About);
      showSuccess('关于内容已更新');
    } catch (error) {
      console.error('关于内容更新失败', error);
      showError('关于内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, About: false }));
    }
  };
  // 个性化设置 - 页脚
  const submitFooter = async () => {
    try {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Footer: true }));
      await updateOption('Footer', inputs.Footer);
      showSuccess('页脚内容已更新');
    } catch (error) {
      console.error('页脚内容更新失败', error);
      showError('页脚内容更新失败');
    } finally {
      setLoadingInput((loadingInput) => ({ ...loadingInput, Footer: false }));
    }
  };

  // 邮件模板设置 - 启用状态
  const submitEmailTemplateEnabled = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplateEnabled: true,
      }));
      // 将布尔值转换为字符串发送给后端
      const value = inputs.EmailTemplateEnabled ? 'true' : 'false';
      await updateOption('EmailTemplateEnabled', value);
      showSuccess(t('邮件模板设置已更新'));
    } catch (error) {
      console.error(t('邮件模板设置更新失败'), error);
      showError(t('邮件模板设置更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplateEnabled: false,
      }));
    }
  };

  // 邮件模板设置 - 验证码邮件模板
  const submitVerificationTemplate = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplate_Verification: true,
      }));
      await updateOption('EmailTemplate_Verification', inputs.EmailTemplate_Verification);
      showSuccess(t('验证码邮件模板已更新'));
    } catch (error) {
      console.error(t('验证码邮件模板更新失败'), error);
      showError(t('验证码邮件模板更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplate_Verification: false,
      }));
    }
  };

  // 邮件模板设置 - 密码重置邮件模板
  const submitPasswordResetTemplate = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplate_PasswordReset: true,
      }));
      await updateOption('EmailTemplate_PasswordReset', inputs.EmailTemplate_PasswordReset);
      showSuccess(t('密码重置邮件模板已更新'));
    } catch (error) {
      console.error(t('密码重置邮件模板更新失败'), error);
      showError(t('密码重置邮件模板更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplate_PasswordReset: false,
      }));
    }
  };

  // 邮件模板设置 - 额度预警邮件模板
  const submitQuotaWarningTemplate = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplate_QuotaWarning: true,
      }));
      await updateOption('EmailTemplate_QuotaWarning', inputs.EmailTemplate_QuotaWarning);
      showSuccess(t('额度预警邮件模板已更新'));
    } catch (error) {
      console.error(t('额度预警邮件模板更新失败'), error);
      showError(t('额度预警邮件模板更新失败'));
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        EmailTemplate_QuotaWarning: false,
      }));
    }
  };

  // 获取模板变量
  const getTemplateVariables = async () => {
    try {
      const res = await API.get('/api/email_template_variables');
      const { success, data } = res.data;
      if (success) {
        setTemplateVariables(data);
      }
    } catch (error) {
      console.error('获取模板变量失败', error);
    }
  };

  // 预览模板
  const previewTemplate = (templateType) => {
    const templateContent = inputs[`EmailTemplate_${templateType}`];
    if (!templateContent) {
      showError(t('模板内容为空'));
      return;
    }

    // 使用示例数据替换变量
    let preview = templateContent;
    preview = preview.replace(/\{\{username\}\}/g, '示例用户');
    preview = preview.replace(/\{\{verification_code\}\}/g, '123456');
    preview = preview.replace(/\{\{reset_link\}\}/g, 'https://example.com/reset?token=example');
    preview = preview.replace(/\{\{site_name\}\}/g, inputs.SystemName || 'AI服务平台');
    preview = preview.replace(/\{\{valid_minutes\}\}/g, '15');
    // 额度预警相关变量
    preview = preview.replace(/\{\{warning_message\}\}/g, '您的额度即将用尽');
    preview = preview.replace(/\{\{remaining_quota\}\}/g, '$5.00');
    preview = preview.replace(/\{\{topup_link\}\}/g, 'https://example.com/topup');
    // Logo 地址
    preview = preview.replace(/\{\{logo_url\}\}/g, inputs.Logo || '/logo.png');

    setPreviewContent(preview);
    setCurrentTemplateType(templateType);
    setShowTemplatePreview(true);
  };

  const checkUpdate = async () => {
    try {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        CheckUpdate: true,
      }));
      // Use a CORS proxy to avoid direct cross-origin requests to GitHub API
      // Option 1: Use a public CORS proxy service
      // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      // const res = await API.get(
      //   `${proxyUrl}https://api.github.com/repos/Calcium-Ion/new-api/releases/latest`,
      // );

      // Option 2: Use the JSON proxy approach which often works better with GitHub API
      const res = await fetch(
        'https://api.github.com/repos/Calcium-Ion/new-api/releases/latest',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            // Adding User-Agent which is often required by GitHub API
            'User-Agent': 'new-api-update-checker',
          },
        },
      ).then((response) => response.json());

      // Option 3: Use a local proxy endpoint
      // Create a cached version of the response to avoid frequent GitHub API calls
      // const res = await API.get('/api/status/github-latest-release');

      const { tag_name, body } = res;
      if (tag_name === statusState?.status?.version) {
        showSuccess(`已是最新版本：${tag_name}`);
      } else {
        setUpdateData({
          tag_name: tag_name,
          content: marked.parse(body),
        });
        setShowUpdateModal(true);
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
      showError('检查更新失败，请稍后再试');
    } finally {
      setLoadingInput((loadingInput) => ({
        ...loadingInput,
        CheckUpdate: false,
      }));
    }
  };
  const getOptions = async () => {
    const res = await API.get('/api/option/');
    const { success, message, data } = res.data;
    if (success) {
      let newInputs = {};
      data.forEach((item) => {
        if (item.key in inputs) {
          newInputs[item.key] = item.value;
        }
      });
      // 确保邮件模板开关有默认值
      if (!newInputs.hasOwnProperty('EmailTemplateEnabled')) {
        newInputs.EmailTemplateEnabled = 'false';
      }
      // 为Switch组件转换布尔值
      newInputs.EmailTemplateEnabled = newInputs.EmailTemplateEnabled === 'true';
      setInputs(newInputs);
      formAPISettingGeneral.current.setValues(newInputs);
      formAPIPersonalization.current.setValues(newInputs);
      formAPIEmailTemplate.current.setValues(newInputs);
    } else {
      showError(message);
    }
  };

  useEffect(() => {
    getOptions();
    getTemplateVariables();
  }, []);

  // Function to open GitHub release page
  const openGitHubRelease = () => {
    window.open(
      `https://github.com/Calcium-Ion/new-api/releases/tag/${updateData.tag_name}`,
      '_blank',
    );
  };

  const getStartTimeString = () => {
    const timestamp = statusState?.status?.start_time;
    return statusState.status ? timestamp2string(timestamp) : '';
  };

  return (
    <Row>
      <Col
        span={24}
        style={{
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* 版本信息 */}
        <Form>
          <Card>
            <Form.Section text={t('系统信息')}>
              <Row>
                <Col span={16}>
                  <Space>
                    <Text>
                      {t('当前版本')}：
                      {statusState?.status?.version || t('未知')}
                    </Text>
                    <Button
                      type='primary'
                      onClick={checkUpdate}
                      loading={loadingInput['CheckUpdate']}
                    >
                      {t('检查更新')}
                    </Button>
                  </Space>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <Text>
                    {t('启动时间')}：{getStartTimeString()}
                  </Text>
                </Col>
              </Row>
            </Form.Section>
          </Card>
        </Form>
        {/* 通用设置 */}
        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPISettingGeneral.current = formAPI)}
        >
          <Card>
            <Form.Section text={t('通用设置')}>
              <Form.TextArea
                label={t('公告')}
                placeholder={t(
                  '在此输入新的公告内容，支持 Markdown & HTML 代码',
                )}
                field={'Notice'}
                onChange={handleInputChange}
                style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                autosize={{ minRows: 6, maxRows: 12 }}
              />
              <Button onClick={submitNotice} loading={loadingInput['Notice']}>
                {t('设置公告')}
              </Button>
              <Form.TextArea
                label={t('充值公告')}
                placeholder={t(
                  '在此输入充值公告内容，支持 Markdown & HTML 代码，将显示在充值页面右侧区域',
                )}
                field={'TopUpNotice'}
                onChange={handleInputChange}
                style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                autosize={{ minRows: 6, maxRows: 12 }}
              />
              <Button onClick={submitTopUpNotice} loading={loadingInput['TopUpNotice']}>
                {t('设置充值公告')}
              </Button>
            </Form.Section>
          </Card>
        </Form>
        {/* 个性化设置 */}
        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPIPersonalization.current = formAPI)}
        >
          <Card>
            <Form.Section text={t('个性化设置')}>
              <Form.Input
                label={t('系统名称')}
                placeholder={t('在此输入系统名称')}
                field={'SystemName'}
                onChange={handleInputChange}
              />
              <Button
                onClick={submitSystemName}
                loading={loadingInput['SystemName']}
              >
                {t('设置系统名称')}
              </Button>
              <Form.Input
                label={t('Logo 图片地址')}
                placeholder={t('在此输入 Logo 图片地址')}
                field={'Logo'}
                onChange={handleInputChange}
              />
              <Button onClick={submitLogo} loading={loadingInput['Logo']}>
                {t('设置 Logo')}
              </Button>
              <Form.TextArea
                label={t('首页内容')}
                placeholder={t(
                  '在此输入首页内容，支持 Markdown & HTML 代码，设置后首页的状态信息将不再显示。如果输入的是一个链接，则会使用该链接作为 iframe 的 src 属性，这允许你设置任意网页作为首页',
                )}
                field={'HomePageContent'}
                onChange={handleInputChange}
                style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                autosize={{ minRows: 6, maxRows: 12 }}
              />
              <Button
                onClick={() => submitOption('HomePageContent')}
                loading={loadingInput['HomePageContent']}
              >
                {t('设置首页内容')}
              </Button>
              <Form.TextArea
                label={t('更新日志')}
                placeholder={t(
                  '在此输入新的关于内容，支持 Markdown & HTML 代码 & JSON Timeline。如果输入的是一个链接，则会使用该链接作为 iframe 的 src 属性，这允许你设置任意网页作为关于页面，JSON Timeline 示例：[ { "date": "2025.05.24", "type": "hot", "title": "启航 AI 服务全面升级", "details": [ "全部模型大幅降价，最大降幅 76%！", "限时充值活动：5.24-6.19 每充值 100 元，即可获得 10 元额外奖励", "服务性能全面提升" ] } ]',
                )}
                field={'About'}
                onChange={handleInputChange}
                style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                autosize={{ minRows: 6, maxRows: 12 }}
              />
              <Button onClick={submitAbout} loading={loadingInput['About']}>
                {t('设置关于')}
              </Button>
              {/*  */}
              <Banner
                fullMode={false}
                type='info'
                description={t(
                  '移除 One API 的版权标识必须首先获得授权，项目维护需要花费大量精力，如果本项目对你有意义，请主动支持本项目',
                )}
                closeIcon={null}
                style={{ marginTop: 15 }}
              />
              <Form.Input
                label={t('页脚')}
                placeholder={t(
                  '在此输入新的页脚，留空则使用默认页脚，支持 HTML 代码',
                )}
                field={'Footer'}
                onChange={handleInputChange}
              />
              <Button onClick={submitFooter} loading={loadingInput['Footer']}>
                {t('设置页脚')}
              </Button>
            </Form.Section>
          </Card>
        </Form>
        {/* 邮件模板设置 */}
        <Form
          values={inputs}
          getFormApi={(formAPI) => (formAPIEmailTemplate.current = formAPI)}
        >
          <Card>
            <Form.Section text={t('邮件模板设置')}>
              <Form.Switch
                label={t('启用邮件模板')}
                field={'EmailTemplateEnabled'}
                onChange={(value) => {
                  // 更新inputs状态，保存为字符串以便后端处理
                  setInputs((inputs) => ({ ...inputs, EmailTemplateEnabled: value }));
                }}
              />
              <Button
                onClick={submitEmailTemplateEnabled}
                loading={loadingInput['EmailTemplateEnabled']}
              >
                {t('保存设置')}
              </Button>

              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '6px' }}>
                <h4>{t('可用的模板变量：')}</h4>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '10px' }}>
                  {t('在邮件模板中使用以下变量，系统会自动替换为实际内容。点击变量可查看详细说明。')}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {Object.entries(templateVariables).map(([variable, description]) => (
                    <Tooltip key={variable} content={`${variable}: ${description}`} position="top">
                      <span
                        style={{
                          padding: '6px 10px',
                          backgroundColor: '#e9ecef',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          cursor: 'help',
                          border: '1px solid #dee2e6',
                          display: 'inline-block'
                        }}
                      >
                        {variable}
                      </span>
                    </Tooltip>
                  ))}
                </div>
                <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
                  <strong>{t('使用示例：')}</strong>
                  <br />
                  {t('验证码邮件：')} <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px', borderRadius: '3px' }}>您的验证码为：{'{{verification_code}}'}</code>
                  <br />
                  {t('密码重置：')} <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px', borderRadius: '3px' }}>点击 &lt;a href="{'{{reset_link}}'}"&gt;此处&lt;/a&gt; 重置密码</code>
                  <br />
                  {t('额度预警：')} <code style={{ backgroundColor: '#e9ecef', padding: '2px 4px', borderRadius: '3px' }}>{'{{warning_message}}'}，剩余额度：{'{{remaining_quota}}'}</code>
                </div>
              </div>

              <Form.TextArea
                label={t('注册验证码邮件模板')}
                placeholder={t('在此输入验证码邮件的HTML模板，支持上述模板变量')}
                field={'EmailTemplate_Verification'}
                onChange={handleInputChange}
                style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                autosize={{ minRows: 10, maxRows: 20 }}
                disabled={!isEmailTemplateEnabled()}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  onClick={submitVerificationTemplate}
                  loading={loadingInput['EmailTemplate_Verification']}
                  disabled={!isEmailTemplateEnabled()}
                >
                  {t('保存验证码模板')}
                </Button>
                <Button
                  type="tertiary"
                  onClick={() => previewTemplate('Verification')}
                  disabled={!isEmailTemplateEnabled()}
                >
                  {t('预览模板')}
                </Button>
              </div>

              <Form.TextArea
                label={t('密码重置邮件模板')}
                placeholder={t('在此输入密码重置邮件的HTML模板，支持上述模板变量')}
                field={'EmailTemplate_PasswordReset'}
                onChange={handleInputChange}
                style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                autosize={{ minRows: 10, maxRows: 20 }}
                disabled={!isEmailTemplateEnabled()}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  onClick={submitPasswordResetTemplate}
                  loading={loadingInput['EmailTemplate_PasswordReset']}
                  disabled={!isEmailTemplateEnabled()}
                >
                  {t('保存重置模板')}
                </Button>
                <Button
                  type="tertiary"
                  onClick={() => previewTemplate('PasswordReset')}
                  disabled={!isEmailTemplateEnabled()}
                >
                  {t('预览模板')}
                </Button>
              </div>

              <Form.TextArea
                label={t('额度预警邮件模板')}
                placeholder={t('在此输入额度预警邮件的HTML模板，支持上述模板变量')}
                field={'EmailTemplate_QuotaWarning'}
                onChange={handleInputChange}
                style={{ fontFamily: 'JetBrains Mono, Consolas' }}
                autosize={{ minRows: 10, maxRows: 20 }}
                disabled={!isEmailTemplateEnabled()}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  onClick={submitQuotaWarningTemplate}
                  loading={loadingInput['EmailTemplate_QuotaWarning']}
                  disabled={!isEmailTemplateEnabled()}
                >
                  {t('保存预警模板')}
                </Button>
                <Button
                  type="tertiary"
                  onClick={() => previewTemplate('QuotaWarning')}
                  disabled={!isEmailTemplateEnabled()}
                >
                  {t('预览模板')}
                </Button>
              </div>
            </Form.Section>
          </Card>
        </Form>
      </Col>
      <Modal
        title={t('新版本') + '：' + updateData.tag_name}
        visible={showUpdateModal}
        onCancel={() => setShowUpdateModal(false)}
        footer={[
          <Button
            key='details'
            type='primary'
            onClick={() => {
              setShowUpdateModal(false);
              openGitHubRelease();
            }}
          >
            {t('详情')}
          </Button>,
        ]}
      >
        <div dangerouslySetInnerHTML={{ __html: updateData.content }}></div>
      </Modal>
      <Modal
        title={t('邮件模板预览') + ' - ' + (
          currentTemplateType === 'Verification' ? t('验证码邮件') :
          currentTemplateType === 'PasswordReset' ? t('密码重置邮件') :
          currentTemplateType === 'QuotaWarning' ? t('额度预警邮件') : t('邮件模板')
        )}
        visible={showTemplatePreview}
        onCancel={() => setShowTemplatePreview(false)}
        width={800}
        footer={[
          <Button
            key='close'
            onClick={() => setShowTemplatePreview(false)}
          >
            {t('关闭')}
          </Button>,
        ]}
      >
        <div
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: '6px',
            padding: '10px',
            maxHeight: '500px',
            overflow: 'auto'
          }}
          dangerouslySetInnerHTML={{ __html: previewContent }}
        ></div>
      </Modal>
    </Row>
  );
};

export default OtherSetting;
