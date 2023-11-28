import axios from 'axios';

const apiURL = 'http://localhost:7020'; //replace with localhost:7020 when testing

const postOfferURL = apiURL + '/api/offers';
const getOfferURL = apiURL + '/api/offers';
const acceptOfferURL = apiURL + '/api/offers/accept';
const getOfferByIdURL = apiURL + '/api/offer-details';

const getRequestURL = apiURL + '/api/requests';
const postRequestURL = apiURL + '/api/requests';
const acceptRequestURL = apiURL + '/api/requests/accept';
const getRequestByIdURL = apiURL + '/api/request-details';

const postLoginURL = apiURL + '/api/login';
const postRegisterURL = apiURL + '/api/register';
const getProfileURL = apiURL + '/api/profile';


export const getAllRequests = (success, failure) => {
    axios({
        method: 'get',
        url: getRequestURL,
        headers: {
          'content-type': 'application/json; charset=utf-8',
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}

export const postRequest = (requestData, success, failure) => {
    axios({
        method: 'post',
        url: postRequestURL,
        data: requestData,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}

export const getRequestById = (requestData, success, failure) => {
    axios({
        method: 'get',
        url: getRequestByIdURL,
        params: {
            id: requestData.id
        },
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}

export const acceptRequest = (requestData, success, failure) => {
    axios({
        method: 'post',
        url: acceptRequestURL,
        data: requestData,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}



export const getAllOffers = (success, failure) => {
    axios({
        method: 'get',
        url: getOfferURL,
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}

export const postOffer = (offerData, success, failure) => {
    axios({
        method: 'post',
        url: postOfferURL,
        data: offerData,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}

export const getOfferById = (offerData, success, failure) => {
    axios({
        method: 'get',
        url: getOfferByIdURL,
        params: {
            id: offerData.id
        },
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}

export const acceptOffer = (offerData, success, failure) => {
    axios({
        method: 'post',
        url: acceptOfferURL,
        data: offerData,
        headers: {
            'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}



export const getProfile = (profileData, success, failure) => {
    axios({
        method: 'get',
        url: getProfileURL,
        params: {
            email: profileData.email
        },
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}

export const postRegister = (registerData, success, failure) => {
    axios({
        method: 'post',
        url: postRegisterURL,
        data: registerData,
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
    })
    .then((response) => {
        success(response);
    }, (error) => {
        failure(error);
    });
}

export const postLogin = (loginData, success, failure) => {
    axios({
        method: 'post',
        url: postLoginURL,
        data: loginData,
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
  })
  .then((response) => {
      success(response);
  }, (error) => {
      failure(error);
  });
}