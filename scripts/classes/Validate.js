class Validate
{
	constructor( data, config, types )
	{
		this.data = data;
		this.messages = Object.create( null );
		this.config = config;
		this.types = types;

		this.validate( data );
	}

	validate( data )
	{
		for ( let i in data )
		{
			if ( data.hasOwnProperty(i) )
			{
				const type = this.config[i];
				
				if ( typeof type !== 'undefined' )
				{
					for ( let y = 0; y < type.length; y++ )
					{
						const checker = this.types[type[y]];
						
						if ( !checker )
						{
							throw new Error( `Данная команда ${type[y]} некорректна` );
						}

						const resultOk = checker.validate( data[i] );

						if ( !resultOk )
						{
							const msg = `Недопустимое значение в поле * ${i} *, ${checker.instructions}`;
							this.messages[i] = ( msg );
						}
					}
				}
			}
		}

		return this.hasErrors();
	}
	
	hasErrors()
	{
		if ( Object.keys( this.messages ).length > 0 )
		{
			for ( let key in this.messages )
			{
				console.log( this.messages[key] )
			}

			return;
		}
		else
		{
			return console.log( 'Данные валидны' );
		}	
	}
}

export {
	Validate as default,
}
