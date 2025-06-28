# Music Management App

This project includes several performance optimizations:

### Bundle Analysis
- **Bundle Analyzer**: Integrated with `rollup-plugin-visualizer`
- Run `npm run analyze` to view bundle composition
- Generated report: `dist/stats.html`

### Code Splitting
- **Lazy Loading**: Dialog components load only when opened
- **Tree Shaking**: Dead code elimination enabled

### Performance Features
- **Source Maps**: Enabled for debugging
- **Gzip/Brotli**: Compression analysis included
- **Console Removal**: Production builds strip console.logs
- **Environment Variables**: Centralized configuration
