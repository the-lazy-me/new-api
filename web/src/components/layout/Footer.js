import React, { useEffect, useState, useMemo, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@douyinfe/semi-ui';
import { getFooterHTML, getLogo, getSystemName } from '../../helpers';
import { StatusContext } from '../../context/Status';

const FooterBar = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState(getFooterHTML());

  const loadFooter = useCallback(() => {
    let footer_html = localStorage.getItem('footer_html');
    if (footer_html) {
      setFooter(footer_html);
    }
  }, []);

  const currentYear = new Date().getFullYear();

  const customFooter = useMemo(() => (
    <footer className="relative bg-semi-color-bg-2 h-auto py-8 px-6 md:px-24 w-full flex flex-col items-center justify-center overflow-hidden">

      <div className="flex flex-col items-center text-center w-full max-w-[800px] space-y-3">
        {/* 版权信息 */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Typography.Text className="text-sm !text-semi-color-text-0 font-medium">
            © {currentYear} {t('{{systemName}}', { systemName: getSystemName() })}. All Rights Reserved.
          </Typography.Text>
        </div>

        {/* 免责声明 */}
        <div className="max-w-[1000px]">
          <Typography.Text className="text-xs !text-semi-color-text-1 leading-relaxed">
            {t('本站API适用于测试和体验目的，请自觉遵守您当地法律法规，切勿用于非法用途，本站不承担任何法律责任。')}
          </Typography.Text>
        </div>

        {/* 技术支持信息 */}
        <div className="flex flex-wrap items-center justify-center gap-1 text-xs">
          <span className="!text-semi-color-text-1">Powered by</span>
          <a
            href="https://github.com/QuantumNous/new-api"
            target="_blank"
            rel="noopener noreferrer"
            className="!text-semi-color-primary font-medium hover:underline transition-all duration-200"
          >
            New API
          </a>
          <span className="!text-semi-color-text-1">&</span>
          <a
            href="https://github.com/songquanpeng/one-api"
            target="_blank"
            rel="noopener noreferrer"
            className="!text-semi-color-primary font-medium hover:underline transition-all duration-200"
          >
            One API
          </a>
        </div>

        {/* 分隔线 */}
        <div className="w-full max-w-[400px] h-px bg-semi-color-border opacity-30 my-1"></div>
      </div>
    </footer>
  ), [currentYear, t]);

  useEffect(() => {
    loadFooter();
  }, [loadFooter]);

  return (
    <div className="w-full">
      {footer ? (
        <div
          className="custom-footer"
          dangerouslySetInnerHTML={{ __html: footer }}
        ></div>
      ) : (
        customFooter
      )}
    </div>
  );
};

export default FooterBar;
