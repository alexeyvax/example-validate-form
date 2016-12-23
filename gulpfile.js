const gulp = require( 'gulp' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    babel = require( 'rollup-plugin-babel' ),
    uglify = require( 'gulp-uglify' ),
		rename = require( 'gulp-rename' ),
    rollup = require( 'gulp-rollup' );

gulp.task( 'rollup', () =>
{
  gulp.src([
    './scripts/index.js',
  ])
  .pipe( sourcemaps.init() )
  .pipe( rollup({
    entry: './scripts/index.js',
    plugins: [
      babel({
        presets: ['es2015-rollup'],
        babelrc: false
      }),
    ],
    format: 'iife'
  }))
	.pipe( rename( 'index.min.js' ) )
	.pipe( uglify().on( 'error', ( e ) =>
  {
      console.log( e );
  }))
  .pipe( sourcemaps.write('.') )
  .pipe( gulp.dest( 'public/' ) )
})

gulp.task( 'watch', () =>
	{
		gulp.watch( 'scripts/**/*.js', ['rollup'] )
	}
);

gulp.task( 'default', ['watch', 'rollup'] );
