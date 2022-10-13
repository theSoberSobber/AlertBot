const axios = require('axios');
const getBuffer = async (url) => {
	try {
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}

module.exports = {
    getBuffer
}

if (require.main === module) {
    const test = async () => {
        const res = await getBuffer("http://www.manit.ac.in/sites/default/files/Urgent%20Notice%20for%20revised%20academic%20calendar%20for%20UG%20Oct.-Dec.%202022.pdf");
        console.log(res);
    }
    test();
}