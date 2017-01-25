(function () {

  angular.module('app.baymax')
    .factory('apiAIService', apiAIService)

    apiAIService.$inject = ['$http', '$q']

    function apiAIService($http, $q) {

      function sendDomainQuery (queryStr) {

        let reqObj = {
          method : 'POST',
          url : 'https://console.api.ai/api/query?v=20150910'
        };

        let reqBody = {
          "q":queryStr,
          "lang":"en",
          "sessionId": Date.now(),
          "resetContexts":false
        };

        let headers = {
          'Accept' : 'application/json, text/plain, */*',
          'Accept-Encoding' : 'gzip, deflate, br',
          'Accept-Language' : 'en-US,en;q=0.8',
          'Authorization' : 'Bearer 472da1c0d7444a2f82aaadf5e7f09102',
          'Connection' : 'keep-alive',
          'Content-Length': JSON.stringify(reqBody).length,
          'Content-Type' : 'application/json;charset=UTF-8',
          'Cookie' : '_gat=1; AWSELB=9D5B4D210CCFFAF1BE1E0CD7C7E6FCBD7B46140CAA653917EDCA8C72E93D557487EB8CCADDE3FE415E45579D21DA955B71D82B5CBB83188E876559AECB9AFBA466D1A80189; _ga=GA1.2.95573678.1482245064',
          'devMode' : 'true',
          'Host' : 'console.api.ai',
          'Origin' : 'https://console.api.ai',
          'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
          'X-XSRF-TOKEN' : '93d047b0-3b7e-4daa-b87f-f61c2f8ded0f'
        };

        reqObj.body = reqBody;
        reqObj.headers = headers;

        return sendHttp(reqObj);

      }

      function sendAPIQuery() {
        //@TODO
      }

      function sendHttp (httpReqObj) {
        return $q(function (res, rej) {
          // if dev route to backend proxy to build request
          if(BAYMAX_CONFIG.http.requireProxy) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', BAYMAX_CONFIG.http.proxyAddress);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
              if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log(xhr.responseText);
                res(JSON.parse(xhr.responseText));
              } else if (xhr.readyState === XMLHttpRequest.DONE) {
                console.warn(xhr.responseText);
                rej(JSON.parse(xhr.responseText));
              }
            };

            xhr.send(JSON.stringify(httpReqObj));
          } else {

            let xhr = new XMLHttpRequest();
            xhr.open(httpReqObj.method, httpReqObj.url);

            for (let i in httpReqObj.headers) {
              xhr.setRequestHeader(i, httpReqObj.headers[i]);
            }

            xhr.onreadystatechange = function () {
              if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                console.log(xhr.responseText);
                res(JSON.parse(xhr.responseText));
              } else if (xhr.readyState === XMLHttpRequest.DONE) {
                console.warn(xhr.responseText);
                rej(JSON.parse(xhr.responseText));
              }
            };

            xhr.send(JSON.stringify(httpReqObj.body));
          }
        })
      }

      return {
        sendDomainQuery : sendDomainQuery,
        sendAPIQuery : sendAPIQuery
      };
    }
})();
