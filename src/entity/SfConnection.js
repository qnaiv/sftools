import jsforce from 'jsforce'


export default class SfConnection {
    constructor(){
        this._conn = new jsforce.Connection();
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