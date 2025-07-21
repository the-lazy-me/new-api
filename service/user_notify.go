package service

import (
	"fmt"
	"one-api/common"
	"one-api/dto"
	"one-api/model"
	"strings"
)

func NotifyRootUser(t string, subject string, content string) {
	user := model.GetRootUser().ToBaseUser()
	err := NotifyUser(user.Id, user.Email, user.GetSetting(), dto.NewNotify(t, subject, content, nil))
	if err != nil {
		common.SysError(fmt.Sprintf("failed to notify root user: %s", err.Error()))
	}
}

func NotifyUser(userId int, userEmail string, userSetting dto.UserSetting, data dto.Notify) error {
	notifyType := userSetting.NotifyType
	if notifyType == "" {
		notifyType = dto.NotifyTypeEmail
	}

	// Check notification limit
	canSend, err := CheckNotificationLimit(userId, data.Type)
	if err != nil {
		common.SysError(fmt.Sprintf("failed to check notification limit: %s", err.Error()))
		return err
	}
	if !canSend {
		return fmt.Errorf("notification limit exceeded for user %d with type %s", userId, notifyType)
	}

	switch notifyType {
	case dto.NotifyTypeEmail:
		// check setting email
		userEmail = userSetting.NotificationEmail
		if userEmail == "" {
			common.SysLog(fmt.Sprintf("user %d has no email, skip sending email", userId))
			return nil
		}
		return sendEmailNotify(userEmail, data)
	case dto.NotifyTypeWebhook:
		webhookURLStr := userSetting.WebhookUrl
		if webhookURLStr == "" {
			common.SysError(fmt.Sprintf("user %d has no webhook url, skip sending webhook", userId))
			return nil
		}

		// 获取 webhook secret
		webhookSecret := userSetting.WebhookSecret
		return SendWebhookNotify(webhookURLStr, webhookSecret, data)
	}
	return nil
}

func sendEmailNotify(userEmail string, data dto.Notify) error {
	// 如果是额度预警邮件且启用了邮件模板，使用模板发送
	if data.Type == dto.NotifyTypeQuotaExceed && common.IsEmailTemplateEnabled() {
		return sendQuotaWarningEmailWithTemplate(userEmail, data)
	}

	// 原有逻辑：处理占位符
	content := data.Content
	for _, value := range data.Values {
		content = strings.Replace(content, dto.ContentValueParam, fmt.Sprintf("%v", value), 1)
	}
	return common.SendEmail(data.Title, userEmail, content)
}

func sendQuotaWarningEmailWithTemplate(userEmail string, data dto.Notify) error {
	// 解析原有的占位符数据
	values := data.Values
	if len(values) < 4 {
		// 如果数据不足，回退到原有逻辑
		content := data.Content
		for _, value := range values {
			content = strings.Replace(content, dto.ContentValueParam, fmt.Sprintf("%v", value), 1)
		}
		return common.SendEmail(data.Title, userEmail, content)
	}

	// 构建模板数据
	templateData := common.EmailTemplateData{
		Username:       userEmail, // 使用邮箱作为用户标识
		SiteName:       common.SystemName,
		WarningMessage: fmt.Sprintf("%v", values[0]), // 预警消息
		RemainingQuota: fmt.Sprintf("%v", values[1]), // 剩余额度
		TopupLink:      fmt.Sprintf("%v", values[2]), // 充值链接
		LogoUrl:        common.Logo,
	}

	// 使用模板发送邮件
	err := common.SendTemplatedEmail(common.EmailTemplateQuotaWarning, data.Title, userEmail, templateData)
	if err != nil {
		// 如果模板发送失败，回退到原有逻辑
		content := data.Content
		for _, value := range values {
			content = strings.Replace(content, dto.ContentValueParam, fmt.Sprintf("%v", value), 1)
		}
		return common.SendEmail(data.Title, userEmail, content)
	}

	return nil
}
