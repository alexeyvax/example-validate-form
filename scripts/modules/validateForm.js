import Validate from '../classes/Validate'

function main()
{
	const form = document.querySelector( 'form' );

	if ( !form )
	{
		return;
	}
	
	const list = form.querySelectorAll( 'ul>li>input' );

	registerHandlers( form, list );
}

function registerHandlers( form, list )
{
	form.addEventListener( 'submit', ( event ) => validate( list, event ) );
}

function validate( list, event )
{
	event.preventDefault();

	let data = {};

	Array.prototype.forEach.call(
		list,
		( item ) => {
			const name = item.name;
			const value = item.value;

			data[name] = value;
		}
		
	);

	const config = {
		name: [
			'isNonEmpty'
		],
		age: [
			'isNumber',
			'isNonEmpty'
		],
		username: [
			'isNonEmpty',
			'isAlphaNum'
		],
		email: [
			'isNonEmpty',
			'isEmailCorrect'
		]
	};

	const types = {
		isNonEmpty: {
			validate: function ( value )
			{
				return value !== '';
			},
			instructions: 'это поле не может быть пустым.'
		},
		isNumber: {
			validate: function ( value )
			{
				return !isNaN( value );
			},
			instructions: `значением может быть только число­, например 1, 3.14 или 2010`
		},
		isAlphaNum: {
			validate: function ( value )
			{
				return !/[^a-zA-Z0-9а-яА-Я]/i.test( value );
			},
			instructions: `значение может содержать только буквы и цифры, специальные символы недопустимы`
		},
		isEmailCorrect: {
			validate: function ( value )
			{
				return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test( value );
			},
			instructions: `введите корректный email`
		}
	};

	new Validate( data, config, types );
}

export {
	main as default,	
}
