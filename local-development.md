# 🚀 本地开发部署指南

本文档提供了在本地环境中设置和开发 New API 项目的详细步骤，适合希望参与项目开发或进行二次开发的开发者。

## 📋 开发环境要求

在开始本地开发之前，请确保您的系统已安装以下软件：

- **Go** 1.21 或更高版本（后端开发）
- **Node.js** 18 或更高版本（前端开发）
- **Bun** 最新版本（推荐的包管理器，比 npm/yarn 快 25 倍）
- **Git**（版本控制）
- **MySQL**（可选，默认使用 SQLite）
- **Redis**（可选，用于提升性能）
- **Visual Studio Code** 或其他代码编辑器

!!! info "关于 Bun"
    Bun是一个超快的JavaScript包管理器、测试运行器和bundler。相比传统的npm或yarn，Bun的安装速度快25倍，是2024年最推荐的JavaScript包管理工具。

## 🛠️ 克隆项目

首先，从 GitHub 克隆 New API 仓库到本地：

```bash
git clone https://github.com/Calcium-Ion/new-api.git
cd new-api
```

## 🔧 后端开发设置

### 安装 Go 依赖

```bash
go mod download
```

### 配置开发环境

New API 支持通过 `.env` 文件配置环境变量。创建 `.env` 文件（可从 `.env.example` 复制）：

```bash
cp .env.example .env
```

编辑 `.env` 文件，根据需要修改配置。以下是开发环境中常用的配置：

```env
PORT=3000
SQL_DSN=root:password@tcp(localhost:3306)/new-api   # 如使用MySQL，取消注释并修改
# REDIS_CONN_STRING=redis://localhost:6379         # 如使用Redis，取消注释并修改
```

!!! tip "提示"
    如果不配置 `SQL_DSN`，系统将默认使用 SQLite 数据库，存储在 `one-api.db` 文件中。

### 运行后端服务

```bash
# 直接运行
go run main.go

# 或者编译后运行
go build -o new-api
./new-api
```

服务默认运行在 `http://localhost:3000`

## 🎨 前端开发设置

New API 的前端代码位于 `web` 目录中，使用 React 和 [semi design 组件库](https://semi.design/zh-CN) 开发。

### 安装 Bun（推荐）

如果还没有安装 Bun，请使用以下命令安装：

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows（使用 WSL）:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**macOS（使用 Homebrew）:**
```bash
brew tap oven-sh/bun
brew install bun
```

安装完成后，重启终端或运行 `source ~/.bashrc`（或 `~/.zshrc`）使 Bun 命令生效。

### 安装前端依赖

```bash
cd web
bun install   # 使用 bun 安装前端依赖
```

### 运行开发服务器

```bash
bun run dev   # 使用 bun 运行开发服务器
```

前端开发服务器默认运行在 `http://localhost:5173`，并配置了代理，会将 API 请求转发到后端服务。

### 构建前端资源

```bash
bun run build   # 使用 bun 构建前端资源
```

构建后的文件会生成到 `web/dist` 目录，后端服务会自动加载这些静态资源。

7. **创建拉取请求**：在 GitHub 上创建 PR，描述您的更改

## 🔍 调试技巧

### 后端调试

1. **查看日志**：
   ```bash
   go run main.go --log-dir ./logs
   ```

2. **使用 Delve 进行调试**：
   ```bash
   go install github.com/go-delve/delve/cmd/dlv@latest
   dlv debug main.go
   ```

### 前端调试

1. **使用 Chrome DevTools**：
   - 打开 Chrome 开发者工具 (F12)
   - 查看 Console 和 Network 标签页

2. **React 开发者工具**：
   - 在 Chrome 中安装 React Developer Tools 扩展
   - 使用它检查组件结构和状态

## 📝 项目结构

New API 项目的目录结构：

```
new-api/                                 # 项目根目录
│  .dockerignore                         # Docker 构建时忽略的文件配置
│  .env.example                          # 环境变量示例文件
│  .gitignore                            # Git 忽略文件配置
│  BT.md                                 # BT（可能是宝塔面板）相关说明文档
│  docker-compose.yml                    # Docker Compose 配置文件，用于容器编排
│  Dockerfile                            # Docker 镜像构建配置
│  go.mod                                # Go 模块依赖配置文件
│  go.sum                                # Go 模块依赖校验和文件
│  LICENSE                               # 项目许可证文件
│  main.go                               # 项目主入口文件
│  makefile                              # 项目构建脚本
│  Midjourney.md                         # Midjourney 服务相关文档
│  one-api.service                       # systemd 服务配置文件
│  README.en.md                          # 英文版项目说明文档
│  README.md                             # 中文版项目说明文档
│  Rerank.md                             # Rerank 功能相关文档
│  Suno.md                               # Suno API 相关文档
│  VERSION                               # 项目版本信息文件
│
├─.github                                # GitHub 相关配置目录
│  │  FUNDING.yml                        # GitHub 赞助配置文件
│  │
│  ├─ISSUE_TEMPLATE                      # GitHub Issue 模板目录
│  │      bug_report.md                  # Bug 报告模板
│  │      config.yml                     # Issue 配置文件
│  │      feature_request.md             # 功能请求模板
│  │
│  └─workflows                           # GitHub Actions 工作流配置目录
│          docker-image-amd64.yml        # AMD64 架构 Docker 镜像构建工作流
│          docker-image-arm64.yml        # ARM64 架构 Docker 镜像构建工作流
│          linux-release.yml             # Linux 平台发布工作流
│          macos-release.yml             # macOS 平台发布工作流
│          windows-release.yml           # Windows 平台发布工作流
│
├─bin                                    # 二进制文件和脚本目录
│      migration_v0.2-v0.3.sql           # 数据库 v0.2 到 v0.3 迁移脚本
│      migration_v0.3-v0.4.sql           # 数据库 v0.3 到 v0.4 迁移脚本
│      time_test.sh                      # 时间测试脚本
│
├─common                                 # 通用功能模块目录
│      constants.go                      # 通用常量定义
│      crypto.go                         # 加密相关功能
│      custom-event.go                   # 自定义事件处理
│      database.go                       # 数据库连接和操作
│      email-outlook-auth.go             # Outlook 邮箱认证
│      email.go                          # 电子邮件功能
│      embed-file-system.go              # 嵌入式文件系统
│      env.go                            # 环境变量处理
│      gin.go                            # Gin 框架相关功能
│      go-channel.go                     # Go 通道管理
│      gopool.go                         # Go 协程池
│      init.go                           # 初始化函数
│      logger.go                         # 日志记录功能
│      pprof.go                          # 性能分析工具
│      rate-limit.go                     # 速率限制功能
│      redis.go                          # Redis 客户端
│      str.go                            # 字符串处理工具
│      topup-ratio.go                    # 充值比率计算
│      utils.go                          # 通用工具函数
│      validate.go                       # 数据验证功能
│      verification.go                   # 验证码相关功能
│
├─constant                               # 常量定义目录
│      cache_key.go                      # 缓存键名常量
│      channel_setting.go                # 渠道设置常量
│      context_key.go                    # 上下文键名常量
│      env.go                            # 环境变量常量
│      finish_reason.go                  # 完成原因常量
│      midjourney.go                     # Midjourney 相关常量
│      task.go                           # 任务相关常量
│      user_setting.go                   # 用户设置常量
│
├─controller                             # 控制器层，处理HTTP请求
│      billing.go                        # 计费控制器
│      channel-billing.go                # 渠道计费控制器
│      channel-test.go                   # 渠道测试控制器
│      channel.go                        # 渠道管理控制器
│      github.go                         # GitHub 相关控制器
│      group.go                          # 用户组控制器
│      linuxdo.go                        # LinuxDo 相关控制器
│      log.go                            # 日志控制器
│      midjourney.go                     # Midjourney 服务控制器
│      misc.go                           # 杂项功能控制器
│      model.go                          # 模型管理控制器
│      oidc.go                           # OpenID Connect 认证控制器
│      option.go                         # 选项设置控制器
│      playground.go                     # 测试场景控制器
│      pricing.go                        # 价格管理控制器
│      redemption.go                     # 兑换码控制器
│      relay.go                          # 请求转发控制器
│      task.go                           # 任务管理控制器
│      telegram.go                       # Telegram 相关控制器
│      token.go                          # 令牌管理控制器
│      topup.go                          # 充值控制器
│      usedata.go                        # 用户数据控制器
│      user.go                           # 用户管理控制器
│      wechat.go                         # 微信相关控制器
│
├─docs                                   # 文档目录
│  ├─api                                 # API 文档
│  │      api_auth.md                    # API 认证文档
│  │      user.md                        # 用户相关 API 文档
│  │
│  └─channel                             # 渠道文档
│          other_setting.md              # 其他设置文档
│
├─dto                                    # 数据传输对象目录
│      audio.go                          # 音频相关 DTO
│      dalle.go                          # DALL-E 相关 DTO
│      embedding.go                      # 嵌入向量相关 DTO
│      error.go                          # 错误响应 DTO
│      file_data.go                      # 文件数据 DTO
│      midjourney.go                     # Midjourney 相关 DTO
│      notify.go                         # 通知相关 DTO
│      openai_request.go                 # OpenAI 请求 DTO
│      openai_response.go                # OpenAI 响应 DTO
│      playground.go                     # 测试场景 DTO
│      pricing.go                        # 价格相关 DTO
│      realtime.go                       # 实时数据 DTO
│      rerank.go                         # 重排序相关 DTO
│      sensitive.go                      # 敏感内容相关 DTO
│      suno.go                           # Suno 相关 DTO
│      task.go                           # 任务相关 DTO
│
├─middleware                             # 中间件目录
│      auth.go                           # 认证中间件
│      cache.go                          # 缓存中间件
│      cors.go                           # 跨域资源共享中间件
│      distributor.go                    # 请求分发中间件
│      gzip.go                           # Gzip 压缩中间件
│      logger.go                         # 日志记录中间件
│      model-rate-limit.go               # 模型级别速率限制中间件
│      rate-limit.go                     # 通用速率限制中间件
│      recover.go                        # 异常恢复中间件
│      request-id.go                     # 请求 ID 中间件
│      turnstile-check.go                # Cloudflare Turnstile 检查中间件
│      utils.go                          # 中间件工具函数
│
├─model                                  # 数据模型目录
│      ability.go                        # 能力模型
│      cache.go                          # 缓存模型
│      channel.go                        # 渠道模型
│      log.go                            # 日志模型
│      main.go                           # 主要模型和ORM配置
│      midjourney.go                     # Midjourney 相关模型
│      option.go                         # 选项设置模型
│      pricing.go                        # 价格模型
│      redemption.go                     # 兑换码模型
│      task.go                           # 任务模型
│      token.go                          # 令牌模型
│      token_cache.go                    # 令牌缓存模型
│      topup.go                          # 充值模型
│      usedata.go                        # 用户数据模型
│      user.go                           # 用户模型
│      user_cache.go                     # 用户缓存模型
│      utils.go                          # 模型工具函数
│
├─relay                                  # 请求转发模块目录
│  │  relay-audio.go                     # 音频请求转发
│  │  relay-image.go                     # 图像请求转发
│  │  relay-mj.go                        # Midjourney 请求转发
│  │  relay-text.go                      # 文本请求转发
│  │  relay_adaptor.go                   # 转发适配器
│  │  relay_embedding.go                 # 嵌入向量请求转发
│  │  relay_rerank.go                    # 重排序请求转发
│  │  relay_task.go                      # 任务请求转发
│  │  websocket.go                       # WebSocket 通信处理
│  │
│  ├─channel                             # 转发渠道目录
│  │  │  adapter.go                      # 通用渠道适配器
│  │  │  api_request.go                  # API 请求处理
│  │  │
│  │  ├─ai360                            # 360 AI 渠道
│  │  │      constants.go                # 360 AI 常量定义
│  │  │
│  │  ├─ali                              # 阿里云 AI 渠道
│  │  │      adaptor.go                  # 阿里云适配器
│  │  │      constants.go                # 阿里云常量定义
│  │  │      dto.go                      # 阿里云数据传输对象
│  │  │      image.go                    # 阿里云图像处理
│  │  │      text.go                     # 阿里云文本处理
│  │  │
│  │  ├─aws                              # AWS AI 渠道
│  │  │      adaptor.go                  # AWS 适配器
│  │  │      constants.go                # AWS 常量定义
│  │  │      dto.go                      # AWS 数据传输对象
│  │  │      relay-aws.go                # AWS 请求转发
│  │  │
│  │  ├─baidu                            # 百度 AI 渠道
│  │  │      adaptor.go                  # 百度适配器
│  │  │      constants.go                # 百度常量定义
│  │  │      dto.go                      # 百度数据传输对象
│  │  │      relay-baidu.go              # 百度请求转发
│  │  │
│  │  ├─baidu_v2                         # 百度 AI v2 版本渠道
│  │  │      adaptor.go                  # 百度 v2 适配器
│  │  │      constants.go                # 百度 v2 常量定义
│  │  │
│  │  ├─claude                           # Claude AI 渠道
│  │  │      adaptor.go                  # Claude 适配器
│  │  │      constants.go                # Claude 常量定义
│  │  │      dto.go                      # Claude 数据传输对象
│  │  │      relay-claude.go             # Claude 请求转发
│  │  │
│  │  ├─cloudflare                       # Cloudflare AI 渠道
│  │  │      adaptor.go                  # Cloudflare 适配器
│  │  │      constant.go                 # Cloudflare 常量定义
│  │  │      dto.go                      # Cloudflare 数据传输对象
│  │  │      relay_cloudflare.go         # Cloudflare 请求转发
│  │  │
│  │  ├─cohere                           # Cohere AI 渠道
│  │  │      adaptor.go                  # Cohere 适配器
│  │  │      constant.go                 # Cohere 常量定义
│  │  │      dto.go                      # Cohere 数据传输对象
│  │  │      relay-cohere.go             # Cohere 请求转发
│  │  │
│  │  ├─deepseek                         # DeepSeek AI 渠道
│  │  │      adaptor.go                  # DeepSeek 适配器
│  │  │      constants.go                # DeepSeek 常量定义
│  │  │
│  │  ├─dify                             # Dify AI 渠道
│  │  │      adaptor.go                  # Dify 适配器
│  │  │      constants.go                # Dify 常量定义
│  │  │      dto.go                      # Dify 数据传输对象
│  │  │      relay-dify.go               # Dify 请求转发
│  │  │
│  │  ├─gemini                           # Google Gemini AI 渠道
│  │  │      adaptor.go                  # Gemini 适配器
│  │  │      constant.go                 # Gemini 常量定义
│  │  │      dto.go                      # Gemini 数据传输对象
│  │  │      relay-gemini.go             # Gemini 请求转发
│  │  │
│  │  ├─jina                             # Jina AI 渠道
│  │  │      adaptor.go                  # Jina 适配器
│  │  │      constant.go                 # Jina 常量定义
│  │  │      relay-jina.go               # Jina 请求转发
│  │  │
│  │  ├─lingyiwanwu                      # 灵医万物 AI 渠道
│  │  │      constrants.go               # 灵医万物常量定义
│  │  │
│  │  ├─minimax                          # MiniMax AI 渠道
│  │  │      constants.go                # MiniMax 常量定义
│  │  │      relay-minimax.go            # MiniMax 请求转发
│  │  │
│  │  ├─mistral                          # Mistral AI 渠道
│  │  │      adaptor.go                  # Mistral 适配器
│  │  │      constants.go                # Mistral 常量定义
│  │  │      text.go                     # Mistral 文本处理
│  │  │
│  │  ├─mokaai                           # MokaAI 渠道
│  │  │      adaptor.go                  # MokaAI 适配器
│  │  │      constants.go                # MokaAI 常量定义
│  │  │      relay-mokaai.go             # MokaAI 请求转发
│  │  │
│  │  ├─moonshot                         # Moonshot AI 渠道
│  │  │      constants.go                # Moonshot 常量定义
│  │  │
│  │  ├─ollama                           # Ollama AI 渠道
│  │  │      adaptor.go                  # Ollama 适配器
│  │  │      constants.go                # Ollama 常量定义
│  │  │      dto.go                      # Ollama 数据传输对象
│  │  │      relay-ollama.go             # Ollama 请求转发
│  │  │
│  │  ├─openai                           # OpenAI 渠道
│  │  │      adaptor.go                  # OpenAI 适配器
│  │  │      constant.go                 # OpenAI 常量定义
│  │  │      relay-openai.go             # OpenAI 请求转发
│  │  │
│  │  ├─openrouter                       # OpenRouter AI 渠道
│  │  │      adaptor.go                  # OpenRouter 适配器
│  │  │      constant.go                 # OpenRouter 常量定义
│  │  │
│  │  ├─palm                             # Google PaLM AI 渠道
│  │  │      adaptor.go                  # PaLM 适配器
│  │  │      constants.go                # PaLM 常量定义
│  │  │      dto.go                      # PaLM 数据传输对象
│  │  │      relay-palm.go               # PaLM 请求转发
│  │  │
│  │  ├─perplexity                       # Perplexity AI 渠道
│  │  │      adaptor.go                  # Perplexity 适配器
│  │  │      constants.go                # Perplexity 常量定义
│  │  │      relay-perplexity.go         # Perplexity 请求转发
│  │  │
│  │  ├─siliconflow                      # SiliconFlow AI 渠道
│  │  │      adaptor.go                  # SiliconFlow 适配器
│  │  │      constant.go                 # SiliconFlow 常量定义
│  │  │      dto.go                      # SiliconFlow 数据传输对象
│  │  │      relay-siliconflow.go        # SiliconFlow 请求转发
│  │  │
│  │  ├─task                             # 任务相关渠道
│  │  │  └─suno                          # Suno 音频生成任务
│  │  │          adaptor.go              # Suno 适配器
│  │  │          models.go               # Suno 模型定义
│  │  │
│  │  ├─tencent                          # 腾讯 AI 渠道
│  │  │      adaptor.go                  # 腾讯适配器
│  │  │      constants.go                # 腾讯常量定义
│  │  │      dto.go                      # 腾讯数据传输对象
│  │  │      relay-tencent.go            # 腾讯请求转发
│  │  │
│  │  ├─vertex                           # Google Vertex AI 渠道
│  │  │      adaptor.go                  # Vertex 适配器
│  │  │      constants.go                # Vertex 常量定义
│  │  │      dto.go                      # Vertex 数据传输对象
│  │  │      relay-vertex.go             # Vertex 请求转发
│  │  │      service_account.go          # Vertex 服务账户
│  │  │
│  │  ├─volcengine                       # 火山引擎 AI 渠道
│  │  │      adaptor.go                  # 火山引擎适配器
│  │  │      constants.go                # 火山引擎常量定义
│  │  │
│  │  ├─xunfei                           # 讯飞 AI 渠道
│  │  │      adaptor.go                  # 讯飞适配器
│  │  │      constants.go                # 讯飞常量定义
│  │  │      dto.go                      # 讯飞数据传输对象
│  │  │      relay-xunfei.go             # 讯飞请求转发
│  │  │
│  │  ├─zhipu                            # 智谱 AI 渠道
│  │  │      adaptor.go                  # 智谱适配器
│  │  │      constants.go                # 智谱常量定义
│  │  │      dto.go                      # 智谱数据传输对象
│  │  │      relay-zhipu.go              # 智谱请求转发
│  │  │
│  │  └─zhipu_4v                         # 智谱 4.0 版本渠道
│  │          adaptor.go                 # 智谱 4.0 适配器
│  │          constants.go               # 智谱 4.0 常量定义
│  │          dto.go                     # 智谱 4.0 数据传输对象
│  │          relay-zhipu_v4.go          # 智谱 4.0 请求转发
│  │
│  ├─common                              # 转发公共模块
│  │      relay_info.go                  # 转发信息
│  │      relay_utils.go                 # 转发工具函数
│  │
│  ├─constant                            # 转发常量目录
│  │      api_type.go                    # API 类型常量
│  │      relay_mode.go                  # 转发模式常量
│  │
│  └─helper                              # 转发辅助功能
│          common.go                     # 通用辅助函数
│          model_mapped.go               # 模型映射
│          price.go                      # 价格计算
│          stream_scanner.go             # 流数据扫描器
│
├─router                                 # 路由配置目录
│      api-router.go                     # API 路由配置
│      dashboard.go                      # 仪表盘路由
│      main.go                           # 主路由配置
│      relay-router.go                   # 转发路由配置
│      web-router.go                     # Web 界面路由配置
│
├─service                                # 服务层目录
│      audio.go                          # 音频服务
│      cf_worker.go                      # Cloudflare Worker 服务
│      channel.go                        # 渠道服务
│      epay.go                           # 电子支付服务
│      error.go                          # 错误处理服务
│      file_decoder.go                   # 文件解码器服务
│      http_client.go                    # HTTP 客户端服务
│      image.go                          # 图像处理服务
│      log_info_generate.go              # 日志信息生成服务
│      midjourney.go                     # Midjourney 服务
│      notify-limit.go                   # 通知限制服务
│      quota.go                          # 配额管理服务
│      sensitive.go                      # 敏感内容过滤服务
│      str.go                            # 字符串处理服务
│      task.go                           # 任务管理服务
│      token_counter.go                  # 令牌计数服务
│      usage_helpr.go                    # 使用量统计辅助服务
│      user_notify.go                    # 用户通知服务
│      webhook.go                        # WebHook 服务
│
├─setting                                # 设置管理目录
│  │  chat.go                            # 聊天设置
│  │  group_ratio.go                     # 用户组比率设置
│  │  midjourney.go                      # Midjourney 设置
│  │  payment.go                         # 支付设置
│  │  rate_limit.go                      # 速率限制设置
│  │  sensitive.go                       # 敏感内容设置
│  │  system_setting.go                  # 系统设置
│  │  user_usable_group.go               # 用户可用组设置
│  │
│  ├─config                              # 配置目录
│  │      config.go                      # 配置加载和处理
│  │
│  ├─model_setting                       # 模型设置目录
│  │      claude.go                      # Claude 模型设置
│  │      gemini.go                      # Gemini 模型设置
│  │      global.go                      # 全局模型设置
│  │
│  ├─operation_setting                   # 运营设置目录
│  │      cache_ratio.go                 # 缓存比率设置
│  │      general_setting.go             # 通用设置
│  │      model-ratio.go                 # 模型比率设置
│  │      operation_setting.go           # 运营设置
│  │
│  └─system_setting                      # 系统设置目录
│          oidc.go                       # OpenID Connect 设置
│
└─web                                    # 前端 Web 界面目录
    │  .gitignore                        # 前端 Git 忽略文件配置
    │  .prettierrc.mjs                   # Prettier 代码格式配置
    │  bun.lockb                         # Bun 包管理器锁文件
    │  index.html                        # 主 HTML 文件
    │  package.json                      # 前端依赖配置
    │  bun.lockb                         # Bun 包管理器锁文件（二进制格式，更快）
    │  README.md                         # 前端说明文档
    │  vercel.json                       # Vercel 部署配置
    │  vite.config.js                    # Vite 构建配置
    │
    ├─public                             # 静态资源目录
    │      favicon.ico                   # 网站图标
    │      logo.png                      # 网站 Logo
    │      ratio.png                     # 比率图片
    │      robots.txt                    # 搜索引擎爬虫配置
    │
    └─src                                # 前端源代码目录
        │  App.js                        # 应用主组件
        │  index.css                     # 主样式文件
        │  index.js                      # 应用入口 JS
        │
        ├─components                     # 组件目录
        │  │  ChannelsTable.js           # 渠道表格组件
        │  │  fetchTokenKeys.js          # 获取令牌 Key 的工具
        │  │  Footer.js                  # 页脚组件
        │  │  HeaderBar.js               # 页头组件
        │  │  LinuxDoIcon.js             # LinuxDo 图标组件
        │  │  Loading.js                 # 加载中组件
        │  │  LoginForm.js               # 登录表单组件
        │  │  LogsTable.js               # 日志表格组件
        │  │  MjLogsTable.js             # Midjourney 日志表格组件
        │  │  ModelPricing.js            # 模型定价组件
        │  │  ModelSetting.js            # 模型设置组件
        │  │  OAuth2Callback.js          # OAuth2 回调组件
        │  │  OIDCIcon.js                # OIDC 图标组件
        │  │  OperationSetting.js        # 运营设置组件
        │  │  OtherSetting.js            # 其他设置组件
        │  │  PageLayout.js              # 页面布局组件
        │  │  PasswordResetConfirm.js    # 密码重置确认组件
        │  │  PasswordResetForm.js       # 密码重置表单组件
        │  │  PersonalSetting.js         # 个人设置组件
        │  │  PrivateRoute.js            # 私有路由组件
        │  │  RateLimitSetting.js        # 速率限制设置组件
        │  │  RedemptionsTable.js        # 兑换码表格组件
        │  │  RegisterForm.js            # 注册表单组件
        │  │  SafetySetting.js           # 安全设置组件
        │  │  SiderBar.js                # 侧边栏组件
        │  │  SystemSetting.js           # 系统设置组件
        │  │  TaskLogsTable.js           # 任务日志表格组件
        │  │  TokensTable.js             # 令牌管理表格组件
        │  │  UsersTable.js              # 用户管理表格组件
        │  │  utils.js                   # 通用工具函数
        │  │  WeChatIcon.js              # 微信图标组件
        │  │
        │  └─custom                      # 自定义组件目录
        │          TextInput.js          # 文本输入框组件
        │          TextNumberInput.js    # 数字输入框组件
        │
        ├─constants                      # 常量定义目录
        │      channel.constants.js      # 渠道相关常量
        │      common.constant.js        # 通用常量
        │      index.js                  # 常量导出索引
        │      toast.constants.js        # 提示消息常量
        │      user.constants.js         # 用户相关常量
        │
        ├─context                        # React Context 上下文目录
        │  ├─Status                      # 状态上下文
        │  │      index.js               # 状态上下文入口
        │  │      reducer.js             # 状态上下文 reducer
        │  │
        │  ├─Style                       # 样式上下文
        │  │      index.js               # 样式上下文入口
        │  │
        │  ├─Theme                       # 主题上下文
        │  │      index.js               # 主题上下文入口
        │  │
        │  └─User                        # 用户上下文
        │          index.js              # 用户上下文入口
        │          reducer.js            # 用户上下文 reducer
        │
        ├─helpers                        # 辅助函数目录
        │      api.js                    # API 请求辅助函数
        │      auth-header.js            # 认证头部处理
        │      data.js                   # 数据处理函数
        │      history.js                # 路由历史管理
        │      index.js                  # 辅助函数导出索引
        │      other.js                  # 其他辅助函数
        │      render.js                 # 渲染辅助函数
        │      utils.js                  # 实用工具函数
        │
        ├─i18n                           # 国际化目录
        │  │  i18n.js                    # 国际化配置文件
        │  │
        │  └─locales                     # 语言包目录
        │          en.json               # 英文语言包
        │          zh.json               # 中文语言包
        │
        └─pages                          # 页面组件目录
            ├─About                      # 关于页面
            │      index.js              # 关于页面入口
            │
            ├─Channel                    # 渠道管理页面
            │      EditChannel.js        # 编辑渠道组件
            │      EditTagModal.js       # 编辑标签模态框
            │      index.js              # 渠道管理页面入口
            │
            ├─Chat                       # 聊天页面
            │      index.js              # 聊天页面入口
            │
            ├─Chat2Link                  # 聊天链接分享页面
            │      index.js              # 聊天链接入口
            │
            ├─Detail                     # 详情页面
            │      index.js              # 详情页面入口
            │
            ├─Home                       # 首页
            │      index.js              # 首页入口
            │
            ├─Log                        # 日志页面
            │      index.js              # 日志页面入口
            │
            ├─Midjourney                 # Midjourney 管理页面
            │      index.js              # Midjourney 页面入口
            │
            ├─NotFound                   # 404 页面
            │      index.js              # 404 页面入口
            │
            ├─Playground                 # 测试场景页面
            │      Playground.js         # 测试场景组件
            │
            ├─Pricing                    # 价格管理页面
            │      index.js              # 价格管理页面入口
            │
            ├─Redemption                 # 兑换码管理页面
            │      EditRedemption.js     # 编辑兑换码组件
            │      index.js              # 兑换码管理页面入口
            │
            ├─Setting                    # 设置页面
            │  │  index.js               # 设置页面入口
            │  │
            │  ├─Model                   # 模型设置页面
            │  │      SettingClaudeModel.js # Claude 模型设置组件
            │  │      SettingGeminiModel.js # Gemini 模型设置组件
            │  │      SettingGlobalModel.js # 全局模型设置组件
            │  │
            │  ├─Operation               # 运营设置页面
            │  │      GroupRatioSettings.js       # 用户组比率设置组件
            │  │      ModelRationNotSetEditor.js  # 模型比率未设置编辑器
            │  │      ModelRatioSettings.js       # 模型比率设置组件
            │  │      ModelSettingsVisualEditor.js # 模型设置可视化编辑器
            │  │      SettingsChats.js            # 聊天设置组件
            │  │      SettingsCreditLimit.js      # 额度限制设置组件
            │  │      SettingsDataDashboard.js    # 数据仪表盘设置组件
            │  │      SettingsDrawing.js          # 绘图设置组件
            │  │      SettingsGeneral.js          # 通用设置组件
            │  │      SettingsLog.js              # 日志设置组件
            │  │      SettingsMonitoring.js       # 监控设置组件
            │  │      SettingsSensitiveWords.js   # 敏感词设置组件
            │  │
            │  └─RateLimit                   # 速率限制设置页面
            │          SettingsRequestRateLimit.js # 请求速率限制设置组件
            │
            ├─Task                           # 任务管理页面
            │      index.js                  # 任务管理页面入口
            │
            ├─Token                          # 令牌管理页面
            │      EditToken.js              # 编辑令牌组件
            │      index.js                  # 令牌管理页面入口
            │
            ├─TopUp                          # 充值页面
            │      index.js                  # 充值页面入口
            │
            └─User                           # 用户管理页面
                    AddUser.js               # 添加用户组件
                    EditUser.js              # 编辑用户组件
                    index.js                 # 用户管理页面入口
```

!!! tip "需要帮助？"
    如果您在开发过程中遇到问题，可以：
    
    1. 查看 [GitHub Issues](https://github.com/Calcium-Ion/new-api/issues)
    2. 加入 [QQ交流群](../support/community-interaction.md)
    3. 通过 [问题反馈](../support/feedback-issues.md) 页面提交问题 