const { fetchRepoList, fetchTagList } = require('./request')
const Inquirer = require('inquirer')
const { wrapLoading } = require('./util')
const downloadGitRepo = require('download-git-repo') //不支持promise
const util = require('util')
const path = require('path')
class Creator {
	constructor(projectName, targetDir) {
		//new 的时候会调用构造函数
		this.name = projectName
		this.target = targetDir
		//此时这个方法就是一个promise方法
		this.downloadGitRepo=util.promisify(downloadGitRepo)
	}
	async fetchRepo() {
		//失败重新拉取
		let repos = await wrapLoading(fetchRepoList, 'waiting fetch template')
		if (!repos) return
		repos = repos.map((item) => item.name)
		let { repo } = await Inquirer.prompt(
			//配置询问的方式
			{
				name: 'repo', //选择完之后的结果
				type: 'list', //展示方式
				message: `please choose a template to create project`, //提示信息
				choices: repos,
			}
		)
		return repo
	}
	async fetchTag(repo) {
		let tags = await wrapLoading(fetchTagList, 'waiting fetch tag', repo)
		if (!tags) return
		tags = tags.map((item) => item.name)
		let { tag } = await Inquirer.prompt(
			//配置询问的方式
			{
				name: 'tag', //选择完之后的结果
				type: 'list', //展示方式
				message: `please choose a tag to create project`, //提示信息
				choices: tags,
			}
		)
		return tag
	}
	async download (repo, tag) {
		//需要拼接出下载路径
		let requestUrl = `chen7-cli/${repo}${tag?'#'+tag:''}`
		//把资源下载到某个路径上(可以增加缓存功能,应该下载到系统目录中，稍后使用ejs handlerbar 去渲染模版 最后生成结果 在写入)
		//放到系统文件中->模版和用户其他选择-》生成结果放到当前目录下
		await this.downloadGitRepo(requestUrl, path.resolve(process.cwd(),`${repo}@${tag}`))
		return  this.target
	}
	//真实开始创建了
	async create() {
		//先去拉取当前组织下的模板
		let repo = await this.fetchRepo()
		//通过模版找到版本号
		let tag = await this.fetchTag(repo)
		//下载
		// let downloadUrl = await this.download(repo, tag);
		await this.downloadGitRepo(repo, tag)
		//编译模版
	}
}

module.exports = Creator
