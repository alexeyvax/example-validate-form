const gulp = require( 'gulp' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    babel = require( 'rollup-plugin-babel' ),
    rollup = require( 'gulp-rollup' );

gulp.task( 'rollup', () =>
{
  gulp.src([
    './scripts/index.js',
  ])
  .pipe( sourcemaps.init() )
  .pipe( rollup({
    allowRealFiles: true,
    entry: './scripts/index.js',
    plugins: [
      babel({
        presets: ['es2015-rollup'],
        babelrc: false
      }),
    ],
    format: 'iife'
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
