Flexo client
=====

Предоставляет прозрачный доступ к методам сервера Flexo.  
Поддерживает соединение с сервером средствами модуля `upnode`.



## init( options, callback )
Производит инициализацию клиента.
В случае ошибки установления связи с сервером вернет ошибку в коллбек.

Параметры:
* `options` - объект
    * `host` - строка, адрес сервера
    * `port` - число, порт сервера
    * `ping` - число, периодичность между проверкой наличия связи с сервером, по умолчанию 10000 мс, чтобы отключить - 0
    * `timeout` - время на получение ответа на пинг, 5000 мс
    * `reconnect` - время между попытками переподключиться, 1000 мс
* `callback( error, container )` - функция
	* `container` - объект, содержит функции работы с библиотекой
	    * `find`
	    * `insert`
	    * `modify`
	    * `delete`
	    * `aggregate`
	    * `groupCount`
