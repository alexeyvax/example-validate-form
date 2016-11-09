(function () {
  'use strict';

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Validate = function () {
  	function Validate(data, config, types) {
  		classCallCheck(this, Validate);

  		this.data = data;
  		this.messages = Object.create(null);
  		this.config = config;
  		this.types = types;

  		this.validate(data);
  	}

  	createClass(Validate, [{
  		key: 'validate',
  		value: function validate(data) {
  			for (var i in data) {
  				if (data.hasOwnProperty(i)) {
  					var type = this.config[i];

  					if (typeof type !== 'undefined') {
  						for (var y = 0; y < type.length; y++) {
  							var checker = this.types[type[y]];

  							if (!checker) {
  								throw new Error('\u0414\u0430\u043D\u043D\u0430\u044F \u043A\u043E\u043C\u0430\u043D\u0434\u0430 ' + type[y] + ' \u043D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430');
  							}

  							var resultOk = checker.validate(data[i]);

  							if (!resultOk) {
  								var msg = '\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 \u043F\u043E\u043B\u0435 * ' + i + ' *, ' + checker.instructions;
  								this.messages[i] = msg;
  							}
  						}
  					}
  				}
  			}

  			return this.hasErrors();
  		}
  	}, {
  		key: 'hasErrors',
  		value: function hasErrors() {
  			if (Object.keys(this.messages).length > 0) {
  				for (var key in this.messages) {
  					console.log(this.messages[key]);
  				}

  				return;
  			} else {
  				return console.log('Данные валидны');
  			}
  		}
  	}]);
  	return Validate;
  }();

  function main() {
  	var form = document.querySelector('form');

  	if (!form) {
  		return;
  	}

  	var list = form.querySelectorAll('ul>li>input');

  	registerHandlers(form, list);
  }

  function registerHandlers(form, list) {
  	form.addEventListener('submit', function (event) {
  		return validate(list, event);
  	});
  }

  function validate(list, event) {
  	event.preventDefault();

  	var data = {};

  	Array.prototype.forEach.call(list, function (item) {
  		var name = item.name;
  		var value = item.value;

  		data[name] = value;
  	});

  	var config = {
  		name: ['isNonEmpty'],
  		age: ['isNumber', 'isNonEmpty'],
  		username: ['isNonEmpty', 'isAlphaNum'],
  		email: ['isNonEmpty', 'isEmailCorrect']
  	};

  	var types = {
  		isNonEmpty: {
  			validate: function validate(value) {
  				return value !== '';
  			},
  			instructions: 'это поле не может быть пустым.'
  		},
  		isNumber: {
  			validate: function validate(value) {
  				return !isNaN(value);
  			},
  			instructions: '\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435\u043C\u202F\u043C\u043E\u0436\u0435\u0442\u202F\u0431\u044B\u0442\u044C\u202F\u0442\u043E\u043B\u044C\u043A\u043E\u202F\u0447\u0438\u0441\u043B\u043E\xAD, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 1, 3.14 \u0438\u043B\u0438 2010'
  		},
  		isAlphaNum: {
  			validate: function validate(value) {
  				return !/[^a-zA-Z0-9а-яА-Я]/i.test(value);
  			},
  			instructions: '\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0431\u0443\u043A\u0432\u044B \u0438 \u0446\u0438\u0444\u0440\u044B, \u0441\u043F\u0435\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0438\u043C\u0432\u043E\u043B\u044B \u043D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B'
  		},
  		isEmailCorrect: {
  			validate: function validate(value) {
  				return (/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(value)
  				);
  			},
  			instructions: '\u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email'
  		}
  	};

  	new Validate(data, config, types);
  }

  main();

}());
//# sourceMappingURL=index.js.map
