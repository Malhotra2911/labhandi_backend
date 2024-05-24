const axios = require("axios");

const sendWhatsappSms = async (phoneNo, ReceiptNo, amount, id, name, address, date, ChequeNo, size, itemType, quantity, modeOfDonation, type, unit) => {
    if (phoneNo.length !== 10) {
        return Promise.reject({
            status: false,
            message: "Please check arguments",
        });
    }

    const number = phoneNo;
    if (modeOfDonation === '1' || modeOfDonation === '2'){
        const msg = `।। सादर जय जिनेन्द्र ।।
    Receipt No. ${ReceiptNo}
    Date: ${date}
    Amount Rs ${amount}
    Name: ${name}
    Address: ${address}

    श्री बड़ेबाबा जी कुण्डलपुर कमेटी आपके द्वारा प्रदत्त दान के लिए अनुमोदना एवं आभार व्यक्त करती है, आप सपरिवार एवं इष्ट मित्रों सहित श्री बड़ेबाबा जी के दर्शनार्थ पधारें ।

    श्री बड़ेबाबा जी चेनल से जुड़ने के लिए नीचे दिए गए लिंक को सब्सक्राइब एवं अधिक से अधिक शेयर करें -
    https://www.youtube.com/@ShreeBadeBaba

    श्री बड़ेबाबा जी कुण्डलपुर में ऑनलाईन के माध्यम से दान देने एवं रूम बुक करने के लिए नीचे दी गई लिंक पर क्लिक करें -
    https://shreebadebaba-562bd.web.app/login

    अधिक जानकारी हेतु कार्यालय के नबंरो पर संपर्क कर सकते हैं -
    दान/कबुलियत हेतु - 7771835891, 9589229944, 9589398877
    आवास/धर्मशाला हेतु - 7771834880`;

        const encodedMsg = encodeURIComponent(msg);
        if (type === 'manual') {
            // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image/${id}.png`;

            try {
                const response = await axios.post(apiUrl);
                console.log('SMS sent successfully:', response.data);
                return {
                    status: true,
                    message: response.data,
                };
            } catch (error) {
                console.error('Error sending SMS:', error.message);
                return Promise.reject({
                    status: false,
                    message: error.message,
                });
            }
        } else if (type === 'electronic') {
            // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image1/${id}.png`;

            try {
                const response = await axios.post(apiUrl);
                console.log('SMS sent successfully:', response.data);
                return {
                    status: true,
                    message: response.data,
                };
            } catch (error) {
                console.error('Error sending SMS:', error.message);
                return Promise.reject({
                    status: false,
                    message: error.message,
                });
            }
        }
    }
    if (modeOfDonation === '3'){
        const msg = `।। सादर जय जिनेन्द्र ।।
    Receipt No. ${ReceiptNo}
    Date: ${date}
    Amount Rs ${amount}
    Cheque No. - ${ChequeNo}
    Name: ${name}
    Address: ${address}

    श्री बड़ेबाबा जी कुण्डलपुर कमेटी आपके द्वारा प्रदत्त दान के लिए अनुमोदना एवं आभार व्यक्त करती है, आप सपरिवार एवं इष्ट मित्रों सहित श्री बड़ेबाबा जी के दर्शनार्थ पधारें ।

    श्री बड़ेबाबा जी चेनल से जुड़ने के लिए नीचे दिए गए लिंक को सब्सक्राइब एवं अधिक से अधिक शेयर करें -
    https://www.youtube.com/@ShreeBadeBaba

    श्री बड़ेबाबा जी कुण्डलपुर में ऑनलाईन के माध्यम से दान देने एवं रूम बुक करने के लिए नीचे दी गई लिंक पर क्लिक करें -
    https://shreebadebaba-562bd.web.app/login

    अधिक जानकारी हेतु कार्यालय के नबंरो पर संपर्क कर सकते हैं -
    दान/कबुलियत हेतु - 7771835891, 9589229944, 9589398877
    आवास/धर्मशाला हेतु - 7771834880`;

        const encodedMsg = encodeURIComponent(msg);
        if (type === 'manual') {
            // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image/${id}.png`;

            try {
                const response = await axios.post(apiUrl);
                console.log('SMS sent successfully:', response.data);
                return {
                    status: true,
                    message: response.data,
                };
            } catch (error) {
                console.error('Error sending SMS:', error.message);
                return Promise.reject({
                    status: false,
                    message: error.message,
                });
            }
        } else if (type === 'electronic') {
            // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image1/${id}.png`;

            try {
                const response = await axios.post(apiUrl);
                console.log('SMS sent successfully:', response.data);
                return {
                    status: true,
                    message: response.data,
                };
            } catch (error) {
                console.error('Error sending SMS:', error.message);
                return Promise.reject({
                    status: false,
                    message: error.message,
                });
            }
        }
    }
    if (modeOfDonation === '4'){
        const msg = `।। सादर जय जिनेन्द्र ।।
    Receipt No. ${ReceiptNo}
    Date: ${date}
    Item: ${itemType}
    Quantity: ${quantity}
    Size: ${size} ${unit}
    Name: ${name}
    Address: ${address}

    श्री बड़ेबाबा जी कुण्डलपुर कमेटी आपके द्वारा प्रदत्त दान के लिए अनुमोदना एवं आभार व्यक्त करती है, आप सपरिवार एवं इष्ट मित्रों सहित श्री बड़ेबाबा जी के दर्शनार्थ पधारें ।

    श्री बड़ेबाबा जी चेनल से जुड़ने के लिए नीचे दिए गए लिंक को सब्सक्राइब एवं अधिक से अधिक शेयर करें -
    https://www.youtube.com/@ShreeBadeBaba

    श्री बड़ेबाबा जी कुण्डलपुर में ऑनलाईन के माध्यम से दान देने एवं रूम बुक करने के लिए नीचे दी गई लिंक पर क्लिक करें -
    https://shreebadebaba-562bd.web.app/login

    अधिक जानकारी हेतु कार्यालय के नबंरो पर संपर्क कर सकते हैं -
    दान/कबुलियत हेतु - 7771835891, 9589229944, 9589398877
    आवास/धर्मशाला हेतु - 7771834880`;

        const encodedMsg = encodeURIComponent(msg);
        if (type === 'manual') {
            // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image/${id}.png`;

            try {
                const response = await axios.post(apiUrl);
                console.log('SMS sent successfully:', response.data);
                return {
                    status: true,
                    message: response.data,
                };
            } catch (error) {
                console.error('Error sending SMS:', error.message);
                return Promise.reject({
                    status: false,
                    message: error.message,
                });
            }
        } else if (type === 'electronic') {
            // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image1/${id}.png`;

            try {
                const response = await axios.post(apiUrl);
                console.log('SMS sent successfully:', response.data);
                return {
                    status: true,
                    message: response.data,
                };
            } catch (error) {
                console.error('Error sending SMS:', error.message);
                return Promise.reject({
                    status: false,
                    message: error.message,
                });
            }
        }
    }
};

const sendOnlineWhatsappSms = async (phoneNo, ReceiptNo, amount, id, name, address, date, ChequeNo, chequeDate, modeOfDonation, type) => {
    if (phoneNo.length !== 10) {
        return Promise.reject({
            status: false,
            message: "Please check arguments",
        });
    }

    const number = phoneNo;
    if (modeOfDonation === 'ONLINE'){
        const msg = `।। सादर जय जिनेन्द्र ।।
    Receipt No. ${ReceiptNo}
    Date: ${date}
    Amount Rs ${amount}
    Name: ${name}
    Address: ${address}

    श्री बड़ेबाबा जी कुण्डलपुर कमेटी आपके द्वारा प्रदत्त दान के लिए अनुमोदना एवं आभार व्यक्त करती है, आप सपरिवार एवं इष्ट मित्रों सहित श्री बड़ेबाबा जी के दर्शनार्थ पधारें ।

    श्री बड़ेबाबा जी चेनल से जुड़ने के लिए नीचे दिए गए लिंक को सब्सक्राइब एवं अधिक से अधिक शेयर करें -
    https://www.youtube.com/@ShreeBadeBaba

    श्री बड़ेबाबा जी कुण्डलपुर में ऑनलाईन के माध्यम से दान देने एवं रूम बुक करने के लिए नीचे दी गई लिंक पर क्लिक करें -
    https://shreebadebaba-562bd.web.app/login

    अधिक जानकारी हेतु कार्यालय के नबंरो पर संपर्क कर सकते हैं -
    दान/कबुलियत हेतु - 7771835891, 9589229944, 9589398877
    आवास/धर्मशाला हेतु - 7771834880`;

        const encodedMsg = encodeURIComponent(msg);
        // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image2/${id}.png`;

        try {
            const response = await axios.post(apiUrl);
            console.log('SMS sent successfully:', response.data);
            return {
                status: true,
                message: response.data,
            };
        } catch (error) {
            console.error('Error sending SMS:', error.message);
            return Promise.reject({
                status: false,
                message: error.message,
            });
        }

    }
    if (modeOfDonation === 'CHEQUE'){
        const msg = `।। सादर जय जिनेन्द्र ।।
    Receipt No. ${ReceiptNo}
    Date: ${chequeDate}
    Amount Rs ${amount}
    Cheque No. - ${ChequeNo}
    Name: ${name}
    Address: ${address}

    श्री बड़ेबाबा जी कुण्डलपुर कमेटी आपके द्वारा प्रदत्त दान के लिए अनुमोदना एवं आभार व्यक्त करती है, आप सपरिवार एवं इष्ट मित्रों सहित श्री बड़ेबाबा जी के दर्शनार्थ पधारें ।

    श्री बड़ेबाबा जी चेनल से जुड़ने के लिए नीचे दिए गए लिंक को सब्सक्राइब एवं अधिक से अधिक शेयर करें -
    https://www.youtube.com/@ShreeBadeBaba

    श्री बड़ेबाबा जी कुण्डलपुर में ऑनलाईन के माध्यम से दान देने एवं रूम बुक करने के लिए नीचे दी गई लिंक पर क्लिक करें -
    https://shreebadebaba-562bd.web.app/login

    अधिक जानकारी हेतु कार्यालय के नबंरो पर संपर्क कर सकते हैं -
    दान/कबुलियत हेतु - 7771835891, 9589229944, 9589398877
    आवास/धर्मशाला हेतु - 7771834880`;

        const encodedMsg = encodeURIComponent(msg);
        // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/image2/${id}.png`;

        try {
            const response = await axios.post(apiUrl);
            console.log('SMS sent successfully:', response.data);
            return {
                status: true,
                message: response.data,
            };
        } catch (error) {
            console.error('Error sending SMS:', error.message);
            return Promise.reject({
                status: false,
                message: error.message,
            });
        }
    }
};

const sendCustomWhatsappSms = async (phoneNumbers, message, media, url) => {
    
    if (!Array.isArray(phoneNumbers)) {
        return Promise.reject({
            status: false,
            message: "Please provide an array of phone numbers"
        });
    }

    const invalidPhoneNumbers = phoneNumbers.some(phoneNo => phoneNo.length !== 12);

    if (invalidPhoneNumbers) {
        return Promise.reject({
            status: false,
            message: "Please add the prefix of 91 or check the mobile number"
        });
    }

    const postdata =  {
        contact: phoneNumbers.map(phoneNo => ({
            number: phoneNo,
            message: message,
            media: media,
            url: url
        }))
    }

    // const apiUrl = 'https://shribalajimessage.com/api/whatsapp/send';
    const apiKey = 'bba5e3d0-2b3a-40fb-a643-313c1901b72f';

    const headers = {
        'Api-key': apiKey,
        'Content-Type': 'application/json'
      };

    try {
        const response = await axios.post(apiUrl, postdata, { headers });
        console.log('SMS sent successfully:', response.data);
        return {
            status: true,
            data: response.data,
        };
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return Promise.reject({
            status: false,
            message: error.message,
        });
    }
};

const checkinWhatsappSms = async (phoneNo, booking_id) => {
    if (phoneNo.length !== 10) {
        return Promise.reject({
            status: false,
            message: "Please check arguments",
        });
    }

    const number = phoneNo;
    const msg = `इस पावन-पुण्य धरा पर कुण्डलपुर कमेटी आपका हार्दिक स्वागत करती है ! भक्तामर विधान, पूज्य श्री  बड़ेबाबा जी का चरणाभिषेक एवं शांतिधारा प्रातः सात  बजे से प्रारंभ होती है, आप सपरिवार पधारकर पुण्यार्जन करें !`
    const encodedMsg = encodeURIComponent(msg);
    // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/checkin/${booking_id}.png`;

    try {
        const response = await axios.post(apiUrl);
        console.log('SMS sent successfully:', response.data);
        return {
            status: true,
            message: response.data,
        };
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return Promise.reject({
            status: false,
            message: error.message,
        });
    }
};

const checkoutWhatsappSms = async (phoneNo, booking_id) => {
    if (phoneNo.length !== 10) {
        return Promise.reject({
            status: false,
            message: "Please check arguments",
        });
    }

    const number = phoneNo;
    const msg = `दिगम्बर जैन सिद्धक्षेत्र कुण्डलगिरि कुण्डलपुर, दमोह में पधारने के लिए आपका बहुत-बहुत धन्यवाद`
    const encodedMsg = encodeURIComponent(msg);
    // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2&img1=https://kundalpur.techjainsupport.co.in/uploads/images/checkout/${booking_id}.png`;

    try {
        const response = await axios.post(apiUrl);
        console.log('SMS sent successfully:', response.data);
        return {
            status: true,
            message: response.data,
        };
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return Promise.reject({
            status: false,
            message: error.message,
        });
    }
};

const bhojnalayWhatsappSms = async (phoneNo, bookingId) => {
    if (phoneNo.length !== 10) {
        return Promise.reject({
            status: false,
            message: "Please check arguments",
        });
    }

    const number = phoneNo;
    const msg = `Thank-you For Ordering. Your Receipt No. is ${bookingId}`
    const encodedMsg = encodeURIComponent(msg);
    // const apiUrl = `http://api.shribalajimessage.com/whatsapp/api/send?mobile=${number}&msg=${encodedMsg}&apikey=ae72ad65946042caaee0d0d2a997bbd2`;


    try {
        const response = await axios.post(apiUrl);
        console.log('SMS sent successfully:', response.data);
        return {
            status: true,
            message: response.data,
        };
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        return Promise.reject({
            status: false,
            message: error.message,
        });
    }
}

module.exports = { sendWhatsappSms, sendOnlineWhatsappSms, sendCustomWhatsappSms, checkinWhatsappSms, checkoutWhatsappSms, bhojnalayWhatsappSms };
