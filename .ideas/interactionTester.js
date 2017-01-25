function getSentences(intentJson) {
	return intentJson.userSays.map(function(a) {
		return a.data.reduce((b, c)=>b+c.text, '');
	})
}

var noop = function(){};

var modules = {
	ModuleRouter : {
		clientToken : '61e62ec167fd4b38bea09cc19c5b85ee ',
		developerToken : '89a3583d6c40441690dfe3813e08d97c',
		parentModules : [],
		actions : {},
		objectContextName : ''
	},
	Field : {
		clientToken : '25969bd8bf704f619cf3560988647f3c',
		developerToken : 'e4c99a6c0b1c41ac9efadf0138b76da5',
		parentModules : [],
		actions : {
			'field.editText' : noop,
			'field.editDate' : noop
		},
		objectContextName : ''
	},
	RecordModule : {
		clientToken : '13cab40a4f064b92a90c6b3da47e3f27',
		developerToken : '5ce97635896c4db8a84b07c80fdf3c27',
		parentModules : ['Field'],
		actions : {
			'record.addTag' : noop,
			'record.setTitle' : noop
		},
		objectContextName : ''
	},
	NoteModule : {
		clientToken : 'e298f72b4a7c409f9d05322d646e1006',
		developerToken : '472da1c0d7444a2f82aaadf5e7f09102',
		parentModules : ['RecordModule', 'Field'],
		actions : {

		},
		objectContextName : 'NoteObject'
	},
	ReminderModule : {
		clientToken : '98347ed543334713bb73bbc6badbecff',
		developerToken : 'bcb3f332d4fe43c7950bbc7f8fd6420d',
		parentModules : ['RecordModule', 'Field'],
		actions : {
			'reminder.save' : addToContext,
			'reminder.silence' : noop
		},
		objectContextName : 'ReminderObject'
	},
	SearchModule : {
		clientToken : 'cb70e1a0b619473fa282513457679ed5',
		developerToken : '4b5ae722a782425194ba5736f753b084',
		parentModules : ['RecordModule', 'Field'],
		actions : {},
		objectContextName : 'SearchObject'
	},
	CommandSeperator2 : {
		clientToken : 'a9187be4c49d4b3498ba5d991df434c4',
		developerToken : '9b75c9ff9225461e9f44c5016bf7232e',
		parentModules : [],
		actions : {},
		objectContextName : ''
	},
	GroceryModule : {
		clientToken : '86d1933c91914e6d90f65476d47cd6bd',
		developerToken : 'b77a9e93295e40cfb159459a9e427708',
		parentModules : ['RecordModule', 'Field'],
		actions : {},
		objectContextName : 'GroceryItem'
	},
	HomeworkModule : {
		clientToken : '5d956c56a3574c669020efd6456945d2',
		developerToken : 'c94ea1a6d12847b6ad2f0386c1dddaa8',
		parentModules : ['RecordModule', 'Field'],
		actions : {},
		objectContextName : 'HomeworkItem'
	}
};

var context = [];

function addToContext(moduleName) {
	if(modules[moduleName].objectContextName) {
		context[0] = {
			name:modules[moduleName].objectContextName,
			moduleName : moduleName
		};
	}
}

function assist2 (str) {

	sendToModule('CommandSeperator2', {
		query : str,
		contexts : []
	}).then(function (respObj) {
		var results = [];
		if(respObj.result.parameters.commands.length > 1) {
			context = [];
		}
		var seriesCommandsPromise = respObj.result.parameters.commands.reduce(function (prevPromise, commandStr) {
			return prevPromise.then(function (res) {
				return processSingle(commandStr).then(function (result) {
					res.push(result);
					return res;
				});
			});
		}, Promise.resolve([]));
		return seriesCommandsPromise;
	})
}


function processSingle(str) {
	var responsePromises = sendQuery(str)

	return Promise.all(responsePromises).then(function (responseObjs) {
		var sortedArr = _.chain(responseObjs)
			.filter((a) => {return (a && a.result.metadata.intentName != 'Default Fallback Intent')})
			.sortBy('result.score')
			.reverse()
			.value();
		// var sortedArr = _.sortBy(responseObjs, 'result.score').reverse();

		console.log(responsePromises, sortedArr);

		handleResponseObj(sortedArr[0]);
	});
}

function handleResponseObj (respObj) {
	try{
		(modules[respObj.module].actions[respObj.result.action] || addToContext)(respObj.module);
		console.log('Handled ', respObj.result.metadata.intentName, respObj.result.action, respObj.result.parameters);
	} catch (e) {
		console.info(e, respObj);
	}
}

function sendQuery (str) {
	var beenHandled = false;
	var responsePromises = [];
	// send to ModuleRouter
	var rootProm = sendToRootModules(str);

	if(context.length)  {
		// send to context inheritance tree
		var curMod = context[0].moduleName;
		var contextHierarchy = [curMod, ...(modules[curMod].parentModules||[])].map(function (moduleName) {
			return sendToModule(moduleName, {
				query : str,
				contexts : (modules[moduleName].objectContextName) ? [{
					name : modules[moduleName].objectContextName
				}] : []
			});
		});
	}

	return [rootProm, ...(contextHierarchy||[])];
}

function sendToRootModules (str) {
	return sendToModule('ModuleRouter', {
		query : str,
		contexts : []
	}).then(function (resData) {
		// route to proper root module
		var rootMod = resData.result.metadata.intentName;
		if(rootMod != 'Default Fallback Intent') {
			// sends to root module
			return sendToModule(rootMod, {
				query : str,
				contexts : context
			})
		} else {
			return Promise.resolve(null);
		}
	});
}

function sendToModule (moduleName, body) {
	var defaultVal = {
		url : 'https://api.api.ai/v1/query',
		method : 'POST',
		headers : {
			'Content-Type' : 'application/json; charset=utf-8',
			'Authorization' : 'Bearer ' + modules[moduleName].developerToken
		},
		body : {
			lang : 'en',
			sessionId : Date.now().toString() + Math.random().toString().slice(8)
		}
	}

	var httpObj = {};
	_.merge(httpObj, defaultVal, modules[moduleName], {body: body})

	return sendHttp(httpObj).then(a=> {a.module = moduleName; return a;});
}

function sendHttp (httpObj) {
	return new Promise(function (res, rej) {
		var xhr = new XMLHttpRequest();
		xhr.open(httpObj.method, httpObj.url);
		_.forEach(httpObj.headers, function (v, k) {
			xhr.setRequestHeader(k, v);
		});
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) { // `DONE`
				if (xhr.status == 200) {
					res(JSON.parse(xhr.responseText));
				} else {
					rej(xhr);
				}
			}
		};
		xhr.send(JSON.stringify(httpObj.body));
	})
}
