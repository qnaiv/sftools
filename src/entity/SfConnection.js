import jsforce from 'jsforce'


export default class SfConnection {
    constructor(orgType){
        this._conn = new jsforce.Connection({
            loginUrl: `https://${orgType === 'sandbox' ? 'test' : 'login'}.salesforce.com`
        });
    }

    login(account, redirectUrl){
        this._conn.login(account.userName, account.password, (err) => {
            if(err){
                window.alert(err);
                return;
            }
            window.open(`${this._conn.instanceUrl}/secur/frontdoor.jsp?sid=${this._conn.accessToken}&retURL=${redirectUrl}`)
        })
    }
}