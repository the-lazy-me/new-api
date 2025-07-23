package model

import (
	"encoding/json"
	"fmt"
	"one-api/common"
	"one-api/setting/ratio_setting"
	"one-api/types"
	"strings"
	"sync"
	"time"
)

type Pricing struct {
	ModelName       string   `json:"model_name"`
	QuotaType       int      `json:"quota_type"`
	ModelRatio      float64  `json:"model_ratio"`
	ModelPrice      float64  `json:"model_price"`
	OwnerBy         string   `json:"owner_by"`
	CompletionRatio float64  `json:"completion_ratio"`
	EnableGroup     []string `json:"enable_groups"`
	Tags            []string `json:"tags"`
}

var (
	pricingMap         []Pricing
	lastGetPricingTime time.Time
	updatePricingLock  sync.Mutex
)

func GetPricing() []Pricing {
	if time.Since(lastGetPricingTime) > time.Minute*1 || len(pricingMap) == 0 {
		updatePricingLock.Lock()
		defer updatePricingLock.Unlock()
		// Double check after acquiring the lock
		if time.Since(lastGetPricingTime) > time.Minute*1 || len(pricingMap) == 0 {
			updatePricing()
		}
	}
	return pricingMap
}

// GetCustomModelTags 获取模型的自定义标签
func GetCustomModelTags(modelName string) []string {
	// 检查自定义模型配置是否启用
	common.OptionMapRWMutex.RLock()
	enabled, ok := common.OptionMap["CustomModelConfigEnabled"]
	if !ok || enabled != "true" {
		common.OptionMapRWMutex.RUnlock()
		return nil
	}

	// 获取自定义模型信息
	modelInfoStr, ok := common.OptionMap["CustomModelInfo"]
	common.OptionMapRWMutex.RUnlock()

	if !ok || modelInfoStr == "" || modelInfoStr == "{}" {
		return nil
	}

	// 解析 JSON
	var modelInfo map[string]interface{}
	if err := json.Unmarshal([]byte(modelInfoStr), &modelInfo); err != nil {
		return nil
	}

	// 获取指定模型的信息
	modelData, ok := modelInfo[modelName]
	if !ok {
		return nil
	}

	// 转换为 map
	modelMap, ok := modelData.(map[string]interface{})
	if !ok {
		return nil
	}

	// 获取 tags 字段
	tagsInterface, ok := modelMap["tags"]
	if !ok {
		return nil
	}

	tagsStr, ok := tagsInterface.(string)
	if !ok {
		return nil
	}

	// 按 | 分割标签并去除空白
	tags := strings.Split(tagsStr, "|")
	result := make([]string, 0, len(tags))
	for _, tag := range tags {
		tag = strings.TrimSpace(tag)
		if tag != "" {
			result = append(result, tag)
		}
	}

	return result
}

func updatePricing() {
	//modelRatios := common.GetModelRatios()
	enableAbilities, err := GetAllEnableAbilityWithChannels()
	if err != nil {
		common.SysError(fmt.Sprintf("GetAllEnableAbilityWithChannels error: %v", err))
		return
	}
	modelGroupsMap := make(map[string]*types.Set[string])

	for _, ability := range enableAbilities {
		groups, ok := modelGroupsMap[ability.Model]
		if !ok {
			groups = types.NewSet[string]()
			modelGroupsMap[ability.Model] = groups
		}
		groups.Add(ability.Group)
	}

	pricingMap = make([]Pricing, 0)
	for model, groups := range modelGroupsMap {
		// 只使用自定义模型标签
		tags := GetCustomModelTags(model)

		pricing := Pricing{
			ModelName:   model,
			EnableGroup: groups.Items(),
			Tags:        tags,
		}
		modelPrice, findPrice := ratio_setting.GetModelPrice(model, false)
		if findPrice {
			pricing.ModelPrice = modelPrice
			pricing.QuotaType = 1
		} else {
			modelRatio, _, _ := ratio_setting.GetModelRatio(model)
			pricing.ModelRatio = modelRatio
			pricing.CompletionRatio = ratio_setting.GetCompletionRatio(model)
			pricing.QuotaType = 0
		}
		pricingMap = append(pricingMap, pricing)
	}
	lastGetPricingTime = time.Now()
}
