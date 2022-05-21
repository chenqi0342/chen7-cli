# chen7-cli
个人的cli工具
# 将包变成全局的
# 1.创建可执行的脚本
# 2.配置package.json中的bin字段
# 3.npm link 链接到本地环境（默认以package.json的name字段为基准）
# link相当于将当前本地模块链接到npm目录下，这个npm目录可以直接访问，所以当前包就可以直接访问了
# npm link --force 强制覆盖
# npm unlink 取消绑定