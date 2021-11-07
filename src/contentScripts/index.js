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

        const lastNameElm = await waitForElement("input[name='last_name']", 5000);
        if(lastNameElm){
            lastNameElm.value = params.get("lastName") || '';
            lastNameElm.dispatchEvent(new Event('input'))
        }

        const firstNameElm = await waitForElement("input[name='first_name']", 5000);
        if(firstNameElm){
            firstNameElm.value = params.get("firstName") || '';
            firstNameElm.dispatchEvent(new Event('input'))
        }
        
        const emailElm = await waitForElement("input[name='email']", 5000);
        if(emailElm){
            emailElm.value = params.get("email") || '';
            emailElm.dispatchEvent(new Event('input'))
        }

        const roleElm = await waitForElement("select[name='job_role']", 5000);
        if(roleElm){
            roleElm.value = params.get("role") || '';
            roleElm.dispatchEvent(new Event('change'))
        }

        const companyElm = await waitForElement("input[name='company']", 5000);
        if(companyElm){
            companyElm.value = params.get("company") || '';
            companyElm.dispatchEvent(new Event('input'))
        }

        const countryElm = await waitForElement("select[name='country']", 5000);
        if(countryElm){
            countryElm.value = params.get("country") || '';
            countryElm.dispatchEvent(new Event('change'))
        }

        const postalCodeElm = await waitForElement("input[name='postal_code']", 5000);
        if(postalCodeElm){
            postalCodeElm.value = params.get("postalCode") || '';
            postalCodeElm.dispatchEvent(new Event('input'))
        }

        const userNameElm = await waitForElement("input[name='username']", 5000);
        if(userNameElm){
            userNameElm.value = params.get("userName") || '';
            userNameElm.dispatchEvent(new Event('input'))
        }
    } catch(e){
        console.log(e);
    }
}
main();