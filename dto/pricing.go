package dto

type OpenAIModels struct {
	Id      string   `json:"id"`
	Object  string   `json:"object"`
	Created int      `json:"created"`
	OwnedBy string   `json:"owned_by"`
	Tags    []string `json:"tags"`
}
