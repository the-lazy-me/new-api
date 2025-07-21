package common

import (
	"fmt"
	"strings"
)

// EmailTemplateType 邮件模板类型
type EmailTemplateType string

const (
	EmailTemplateVerification  EmailTemplateType = "Verification"
	EmailTemplatePasswordReset EmailTemplateType = "PasswordReset"
	EmailTemplateQuotaWarning  EmailTemplateType = "QuotaWarning"
)

// EmailTemplateData 邮件模板数据
type EmailTemplateData struct {
	Username         string
	VerificationCode string
	ResetLink        string
	SiteName         string
	ValidMinutes     int
	// 额度预警相关字段
	WarningMessage string
	RemainingQuota string
	TopupLink      string
	// Logo 地址
	LogoUrl string
}

// IsEmailTemplateEnabled 检查邮件模板功能是否启用
func IsEmailTemplateEnabled() bool {
	OptionMapRWMutex.RLock()
	defer OptionMapRWMutex.RUnlock()
	return OptionMap["EmailTemplateEnabled"] == "true"
}

// GetEmailTemplate 获取指定类型的邮件模板
func GetEmailTemplate(templateType EmailTemplateType) string {
	OptionMapRWMutex.RLock()
	defer OptionMapRWMutex.RUnlock()

	key := fmt.Sprintf("EmailTemplate_%s", string(templateType))
	if template, exists := OptionMap[key]; exists && template != "" {
		return template
	}

	// 如果没有找到模板，返回空字符串
	return ""
}

// RenderEmailTemplate 渲染邮件模板，替换其中的变量
func RenderEmailTemplate(template string, data EmailTemplateData) string {
	if template == "" {
		return ""
	}

	// 替换模板变量
	result := template
	result = strings.ReplaceAll(result, "{{username}}", data.Username)
	result = strings.ReplaceAll(result, "{{verification_code}}", data.VerificationCode)
	result = strings.ReplaceAll(result, "{{reset_link}}", data.ResetLink)
	result = strings.ReplaceAll(result, "{{site_name}}", data.SiteName)
	result = strings.ReplaceAll(result, "{{valid_minutes}}", fmt.Sprintf("%d", data.ValidMinutes))
	// 额度预警相关变量
	result = strings.ReplaceAll(result, "{{warning_message}}", data.WarningMessage)
	result = strings.ReplaceAll(result, "{{remaining_quota}}", data.RemainingQuota)
	result = strings.ReplaceAll(result, "{{topup_link}}", data.TopupLink)
	// Logo 地址
	result = strings.ReplaceAll(result, "{{logo_url}}", data.LogoUrl)

	return result
}

// SendTemplatedEmail 发送使用模板的邮件
func SendTemplatedEmail(templateType EmailTemplateType, subject string, receiver string, data EmailTemplateData) error {
	// 如果邮件模板功能未启用，使用原有的发送方式
	if !IsEmailTemplateEnabled() {
		return nil // 让调用方使用原有逻辑
	}

	// 获取模板
	template := GetEmailTemplate(templateType)
	if template == "" {
		return nil // 让调用方使用原有逻辑
	}

	// 渲染模板
	content := RenderEmailTemplate(template, data)
	if content == "" {
		return nil // 让调用方使用原有逻辑
	}

	// 发送邮件
	return SendEmail(subject, receiver, content)
}

// GetAvailableTemplateVariables 获取可用的模板变量列表
func GetAvailableTemplateVariables() map[string]string {
	return map[string]string{
		"{{username}}":          "用户名",
		"{{verification_code}}": "验证码",
		"{{reset_link}}":        "重置链接",
		"{{site_name}}":         "网站名称",
		"{{valid_minutes}}":     "有效时间（分钟）",
		"{{warning_message}}":   "预警消息",
		"{{remaining_quota}}":   "剩余额度",
		"{{topup_link}}":        "充值链接",
		"{{logo_url}}":          "Logo 地址",
	}
}
