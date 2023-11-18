const axios = require('axios');

const DEV_MODE = false

const apiURL = DEV_MODE ? 'http://localhost:7020' : 'http://localhost:80'; //replace with localhost:7020 when testing
const postOfferURL = apiURL + '/api/offers';
const postRequestURL = apiURL + '/api/requests';
const getOfferURL = apiURL + '/api/offers';
const getRequestURL = apiURL + '/api/requests';
const postFavoriteURL = apiURL + '/api/favorites';
const getFavoritesURL = apiURL + '/api/favorites';
const putOfferURL = apiURL + '/api/offers';
const putRequestURL = apiURL + '/api/requests';
const deleteFavoriteURL = apiURL + '/api/favorites';
const getOfferByIdURL = apiURL + '/api/offer-details';
const getRequestByIdURL = apiURL + '/api/request-details';
const postProfileURL = apiURL + '/api/profile';
const getProfileURL = apiURL + '/api/profile';
const updateProfileURL = apiURL + '/api/update-profile';
const resetPasswordUrl = apiURL + '/api/reset-password';

export const getRequests = (token, success, failure) => {
    axios({
        method: 'get',
        url: getRequestURL,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}
export const postRequest = (requestData, token, success, failure) => {
    axios({
        method: 'post',
        url: postRequestURL,
        data: requestData,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}
export const putRequest = (data, id) => {
    fetch(`${putRequestURL}/${id}`, {
        method: 'put',
        body: JSON.stringify(data),
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(
        res => res.json()
    ).then(
        data => console.log(data)
    )
    .catch(
        error => console.log(error)
    )
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


export const getOffers = (token, success, failure) => {
    axios({
        method: 'get',
        url: getOfferURL,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}
export const postOffer = (offerData, token, success, failure) => {
    axios({
        method: 'post',
        url: postOfferURL,
        data: offerData,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}
export const putOffer = (data, id) => {
    fetch(`${putOfferURL}/${id}`, {
        method: 'put',
        body: JSON.stringify(data),
        headers : { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }).then(
        res => res.json()
    ).then(
        data => console.log(data)
    )
    .catch(
        error => console.log(error)
    )
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


export const postFavorite = (favoriteData, token, success, failure) => {
    axios({
        method: 'post',
        url: postFavoriteURL,
        data: favoriteData,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}
export const getFavorites = (token, success, failure) => {
    axios({
        method: 'get',
        url: getFavoritesURL,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}
export const deleteFavorite = (deleteData, token, success, failure) => {
    axios({
        method: 'delete',
        url: deleteFavoriteURL,
        data: deleteData,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}


export const getProfile = (profileData, token, success, failure) => {
    axios({
        method: 'get',
        url: getProfileURL,
        params: {
            email: profileData.email
        },
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response.data);
    }, (error) => {
        failure(error);
    });
}
export const postUpdateProfile = (updateData, token, success, failure) => {
    axios({
        method: 'post',
        url: updateProfileURL,
        data: updateData,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response);
    }, (error) => {
        failure(error);
    });
}
export const postResetPassword = (resetData, token, success, failure) => {
    axios({
        method: 'post',
        url: resetPasswordUrl,
        data: resetData,
        headers: {
            'content-type': 'application/json; charset=utf-8',
            'Authorization': `${token}`
        }
    })
    .then((response) => {
        success(response);
    }, (error) => {
        failure(error);
    });
}
export const postProfile = (profileData, token, success, failure) => {
    axios({
        method: 'post',
        url: postProfileURL,
        data: profileData,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'Authorization': `${token}`
        }
  })
  .then((response) => {
      success(response);
  }, (error) => {
      failure(error);
  });
}