import { querySelectorDeep } from 'query-selector-shadow-dom';

function waitForElement(selector, timeoutMs){
    const startTimeInMs = Date.now();
    return new Promise((resolve)=>{
        function findLoop(){
            const elements = querySelectorDeep(selector);
            if(elements != null){
                resolve(elements);
            }
            setTimeout(()=>{
                if(Date.now() - startTimeInMs > timeoutMs) resolve(null);
                findLoop();
            }, 1000)
        }
        findLoop();
    })
}
async function main(){
    try{
        const params = new URLSearchParams(window.location.search);

        const lastNameElm = await waitForElement("input[name='last_name']", 1000);
        if(lastNameElm) lastNameElm.value = params.get("lastName") || '';

        const firstNameElm = await waitForElement("input[name='first_name']", 1000);
        if(firstNameElm) firstNameElm.value = params.get("firstName") || '';
        
        const emailElm = await waitForElement("input[name='email']", 1000);
        if(emailElm) emailElm.value = params.get("email") || '';

        const roleElm = await waitForElement("select[name='job_role']", 1000);
        if(roleElm) roleElm.value = params.get("role") || '';

        const companyElm = await waitForElement("input[name='company']", 1000);
        if(companyElm) companyElm.value = params.get("company") || '';

        const countryElm = await waitForElement("select[name='country']", 1000);
        if(countryElm) countryElm.value = params.get("country") || '';

        const postalCodeElm = await waitForElement("input[name='postal_code']", 1000);
        if(postalCodeElm) postalCodeElm.value = params.get("postalCode") || '';

        const userNameElm = await waitForElement("input[name='username']", 1000);
        if(userNameElm) userNameElm.value = params.get("userName") || '';
    } catch(e){
        console.log(e);
    }
}
main();