import querystring from 'querystring'

// eslint-disable-next-line no-restricted-globals
const parsed = querystring.parse(location.search.slice(1))
console.log(parsed);
document.getElementById('last_name').value = parsed.lastName || ''
document.getElementById('first_name').value = parsed.firstName || ''
document.getElementById('email').value = parsed.email || ''
document.getElementById('job_role').value = parsed.role || ''
document.getElementById('job_role').value = parsed.role || ''
document.getElementById('company').value = parsed.company || ''
document.getElementById('country').value = parsed.country || ''
document.getElementById('postal_code').value = parsed.postalCode || ''
document.getElementById('username').value = parsed.userName || ''