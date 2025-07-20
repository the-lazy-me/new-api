import React, { useEffect, useState, useRef } from 'react';
import { Button, Col, Form, Row, Spin, Banner } from '@douyinfe/semi-ui';
import {
  compareObjects,
  API,
  showError,
  showSuccess,
  showWarning,
  verifyJSON,
} from '../../../helpers';
import { useTranslation } from 'react-i18next';

export default function SettingGlobalModel(props) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({
    'global.pass_through_request_enabled': false,
    'general_setting.ping_interval_enabled': false,
    'general_setting.ping_interval_seconds': 60,
    'CustomModelConfigEnabled': false,
    'CustomModelInfo': '{}',
    'CustomModelVendorInfo': '{}',
  });
  const refForm = useRef();
  const [inputsRow, setInputsRow] = useState({
    'global.pass_through_request_enabled': false,
    'general_setting.ping_interval_enabled': false,
    'general_setting.ping_interval_seconds': 60,
    'CustomModelConfigEnabled': false,
    'CustomModelInfo': '{}',
    'CustomModelVendorInfo': '{}',
  });

  function onSubmit() {
    // 验证 JSON 格式
    if (inputs['CustomModelConfigEnabled']) {
      if (!verifyJSON(inputs['CustomModelInfo'])) {
        return showError(t('模型信息 JSON 格式错误'));
      }
      if (!verifyJSON(inputs['CustomModelVendorInfo'])) {
        return showError(t('模型厂商信息 JSON 格式错误'));
      }
    }

    const updateArray = compareObjects(inputsRow, inputs);
    if (!updateArray.length) return showWarning(t('你似乎并没有修改什么'));

    const requestQueue = updateArray.map((item) => {
      let value = String(inputs[item.key]);

      return API.put('/api/option/', {
        key: item.key,
        value,
      });
    });

    setLoading(true);
    Promise.all(requestQueue)
      .then((res) => {
        if (requestQueue.length === 1) {
          if (res.includes(undefined)) return;
        } else if (requestQueue.length > 1) {
          if (res.includes(undefined))
            return showError(t('部分保存失败，请重试'));
        }
        showSuccess(t('保存成功'));
        props.refresh();
      })
      .catch((error) => {
        showError(t('保存失败，请重试'));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    const initialKeys = [
      'global.pass_through_request_enabled',
      'general_setting.ping_interval_enabled',
      'general_setting.ping_interval_seconds',
      'CustomModelConfigEnabled',
      'CustomModelInfo',
      'CustomModelVendorInfo'
    ];

    const currentInputs = {};
    for (let key in props.options) {
      if (initialKeys.includes(key)) {
        let value = props.options[key];

        // 对 JSON 字段进行格式化处理
        if (key === 'CustomModelInfo' || key === 'CustomModelVendorInfo') {
          if (value && value !== '' && value !== '{}') {
            try {
              value = JSON.stringify(JSON.parse(value), null, 2);
            } catch (e) {
              console.error(`解析 ${key} JSON 失败:`, e);
              // 保持原值
            }
          }
        }

        currentInputs[key] = value;
      }
    }
    setInputs(currentInputs);
    setInputsRow(structuredClone(currentInputs));
    if (refForm.current) {
      refForm.current.setValues(currentInputs);
    }
  }, [props.options]);

  return (
    <>
      <Spin spinning={loading}>
        <Form
          values={inputs}
          getFormApi={(formAPI) => (refForm.current = formAPI)}
          style={{ marginBottom: 15 }}
        >
          <Form.Section text={t('全局设置')}>
            <Row>
              <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                <Form.Switch
                  label={t('启用请求透传')}
                  field={'global.pass_through_request_enabled'}
                  onChange={(value) =>
                    setInputs({
                      ...inputs,
                      'global.pass_through_request_enabled': value,
                    })
                  }
                  extraText={
                    t('开启后，所有请求将直接透传给上游，不会进行任何处理（重定向和渠道适配也将失效）,请谨慎开启')
                  }
                />
              </Col>
            </Row>
            
            <Form.Section text={t('连接保活设置')}>
            <Row style={{ marginTop: 10 }}>
                  <Col span={24}>
                    <Banner 
                      type="warning"
                      description={t('警告：启用保活后，如果已经写入保活数据后渠道出错，系统无法重试，如果必须开启，推荐设置尽可能大的Ping间隔')}
                    />
                  </Col>
                </Row>
              <Row>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Form.Switch
                    label={t('启用Ping间隔')}
                    field={'general_setting.ping_interval_enabled'}
                    onChange={(value) => setInputs({ ...inputs, 'general_setting.ping_interval_enabled': value })}
                    extraText={t('开启后，将定期发送ping数据保持连接活跃')}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Form.InputNumber
                    label={t('Ping间隔（秒）')}
                    field={'general_setting.ping_interval_seconds'}
                    onChange={(value) => setInputs({ ...inputs, 'general_setting.ping_interval_seconds': value })}
                    min={1}
                    disabled={!inputs['general_setting.ping_interval_enabled']}
                  />
                </Col>
              </Row>
            </Form.Section>

            <Form.Section text={t('自定义模型配置')}>
              <Row style={{ marginTop: 10 }}>
                <Col span={24}>
                  <Banner
                    type="info"
                    description={t('启用后，可以自定义模型信息和厂商分组，将覆盖系统默认的模型分类和图标显示')}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                  <Form.Switch
                    label={t('使用自定义模型厂商分组和模型信息')}
                    field={'CustomModelConfigEnabled'}
                    onChange={(value) => setInputs({ ...inputs, 'CustomModelConfigEnabled': value })}
                    extraText={t('开启后，将使用下方配置的自定义模型信息和厂商分组')}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <Col span={24}>
                  <Form.TextArea
                    label={t('模型信息')}
                    field={'CustomModelInfo'}
                    value={inputs['CustomModelInfo'] || ''}
                    disabled={!inputs['CustomModelConfigEnabled']}
                    placeholder={`{
  "gpt-4": {
    "note": "OpenAI 最强大的模型",
    "icon": "https://example.com/icon.png",
    "tags": "推荐|高质量|创意",
    "group": "openai"
  }
}`}
                    autosize={{ minRows: 6, maxRows: 12 }}
                    onChange={(value) => setInputs({ ...inputs, 'CustomModelInfo': value })}
                    extraText={inputs['CustomModelConfigEnabled'] ? t('注：JSON格式，共有以下键值，均全为string类型：note（模型说明，支持MD）、icon（模型图标链接，不定义则会自动匹配默认图标库）、tags（模型标签，多个｜分割）、group（模型归属分组，例如OpenAI，与下方【模型厂商信息中的Key相对应】）') : t('启用自定义模型配置后可编辑，不定义则使用默认模型信息')}
                    validateStatus={inputs['CustomModelConfigEnabled'] && !verifyJSON(inputs['CustomModelInfo']) ? 'error' : 'default'}
                    helpText={inputs['CustomModelConfigEnabled'] && !verifyJSON(inputs['CustomModelInfo']) ? 'JSON格式错误' : ''}
                  />
                </Col>
              </Row>

              <Row style={{ marginTop: 20 }}>
                <Col span={24}>
                  <Form.TextArea
                    label={t('模型厂商信息')}
                    field={'CustomModelVendorInfo'}
                    value={inputs['CustomModelVendorInfo'] || ''}
                    disabled={!inputs['CustomModelConfigEnabled']}
                    placeholder={`{
  "openai": {
    "name": "OpenAI",
    "desc": "人工智能研究公司",
    "icon": "https://example.com/openai-icon.png",
    "notice": "使用时请遵守相关政策",
    "sort": "100"
  }
}`}
                    autosize={{ minRows: 6, maxRows: 12 }}
                    onChange={(value) => setInputs({ ...inputs, 'CustomModelVendorInfo': value })}
                    extraText={inputs['CustomModelConfigEnabled'] ? t('注：JSON格式，共有以下键值，均全为string类型：name（厂商名称）、desc（厂商介绍，支持MD）、icon（厂商图标链接，不定义则会自动匹配默认图标库）、notice（厂商使用公告说明，支持MD）、sort（优先级，值越大越靠前）') : t('启用自定义模型配置后可编辑，不定义则使用默认模型厂商信息')}
                    validateStatus={inputs['CustomModelConfigEnabled'] && !verifyJSON(inputs['CustomModelVendorInfo']) ? 'error' : 'default'}
                    helpText={inputs['CustomModelConfigEnabled'] && !verifyJSON(inputs['CustomModelVendorInfo']) ? 'JSON格式错误' : ''}
                  />
                </Col>
              </Row>
            </Form.Section>

            <Row>
              <Button size='default' onClick={onSubmit}>
                {t('保存')}
              </Button>
            </Row>
          </Form.Section>
        </Form>
      </Spin>
    </>
  );
}
