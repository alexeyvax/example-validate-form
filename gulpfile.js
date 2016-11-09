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
    format: 'iife',
    moduleName: 'libraryname',
    sourceMap: true,
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: 'es2015-rollup'
      }),
    ]
  }))
  .pipe( sourcemaps.write('.') )
  .pipe( gulp.dest( 'dist/' ) )
})

gulp.task( 'watch', () =>
	{
		gulp.watch( 'scripts/**/*.js', ['rollup'] )
	}
);

gulp.task( 'default', ['watch', 'rollup'] );
