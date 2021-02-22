export default class Account{
    constructor(account){
        const acct = account || {}
        this.id = acct.id || ''
        this.displayName = acct.displayName || ''
        this.userName = acct.userName || ''
        this.password = acct.password || ''
        this.group = acct.group || 'general'
        this.orgType = acct.orgType || 'production'
    }

    get loginUrl(){
        let loginUrl = ''
        if(this.orgType === 'production'){
          loginUrl = 'http://login.salesforce.com'
        }else if(this.orgType === 'sandbox'){
          loginUrl = 'http://test.salesforce.com'
        }else{
          loginUrl = 'http://login.salesforce.com'
        }
        return loginUrl
    }
    
    get loginParam(){
      return `?locale=jp&un=${ this.userName  }&pw=${ this.password}`
    }

    get loginUrlWithParam(){
        return `${this.loginUrl}/${this.loginParam}`
    }

    get developerConsoleUrl() {
        return `${this.loginUrlWithParam}&startURL=%2F_ui%2Fcommon%2Fapex%2Fdebug%2FApexCSIPage`
    }

    get setupUrl() {
      return `${this.loginUrlWithParam}&startURL=/setup/forcecomHomepage.apexp?setupid=ForceCom`
    }
}