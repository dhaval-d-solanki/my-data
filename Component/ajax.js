/*Author: Dhaval Solanki AJAX related code starts */
ajaxTrim = function(obj){
 $.each( obj, function( key, value ) {
   obj[key] = $.trim(value);
 });
}
ajaxSendRequest = function (url, orgCallback, callback, parameters, methodType, isAsync) {
	parameters = parameters || {};
	console.log(parameters);
	$.ajax({
		url : url,
		timeout : 600000,
		async : isAsync,
		cache : false,
		type : methodType,
		data : parameters,
		dataType : "json",
		success : function (response) {
			orgCallback.callback = typeof orgCallback.callback == 'function' ? orgCallback.callback : $.noop;
			callback(response, orgCallback);
		},
		error : function (jqXHR, textStatus, errorThrown) {
			if (jqXHR.status === 0 || jqXHR.readyState === 0 || jqXHR.statusText == "abort") {
				return;
			}
			// here you can show system error popup
		}
	});
};

ajaxService = function (url, callbackObject, parameters, methodType, isAsync) {
	/*Trim all parameter values*/
	ajaxTrim(parameters);
	ajaxSendRequest(url, callbackObject, ajaxServiceCallback, parameters, methodType, isAsync);
};
ajaxServiceCallback = function (responseObjData, callbackObject) {
	if (responseObjData != null) {
		//if(responseObjData.SessionExpired){} to handle session expired scenario
		callbackObject.callback.call(callbackObject.context, responseObjData);
	}
};

ajaxRequest = function (url, postDataObj, _callback, methodType ) {
	var methodType = !!methodType === false ? methodType : "POST";
	//url, orgCallback, callback, parameters, methodType, isAsync
	ajaxService(url, { callback : _callback, context : this }, postDataObj, methodType, true);	
}
/* AJAX related code ends */
