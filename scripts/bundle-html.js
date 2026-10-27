import fs from 'fs';
import path from 'path';

try {
  const distHtmlPath = path.resolve('dist/index.html');
  if (!fs.existsSync(distHtmlPath)) {
    console.error('dist/index.html not found, run vite build first');
    process.exit(0);
  }

  const html = fs.readFileSync(distHtmlPath, 'utf-8');
  const assetsDir = path.resolve('dist/assets');
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find((f) => f.endsWith('.css'));
  const jsFile = files.find((f) => f.endsWith('.js'));

  let css = '';
  let js = '';

  if (cssFile) {
    css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');
  }
  if (jsFile) {
    js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
  }

  // Inline CSS and JS into single standalone file
  let singleHtml = html;
  if (css) {
    singleHtml = singleHtml.replace(
      /<link rel="stylesheet"[^>]*href="\/assets\/[^"]*"[^>]*>/i,
      `<style>\n${css}\n</style>`
    );
  }
  if (js) {
    singleHtml = singleHtml.replace(
      /<script type="module"[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/i,
      `<script type="module">\n${js.replace(/<\/script>/g, '<\\/script>')}\n</script>`
    );
  }

  // Ensure public exists
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  fs.writeFileSync('public/cif_intranet_aplicacion.html', singleHtml);
  fs.writeFileSync('dist/cif_intranet_aplicacion.html', singleHtml);

  // Also copy to artifact dir if exists
  const artifactDir = '/.aistudio/artifacts/brain/66a02c39-b8b8-449a-91c2-2ae86ecdcf03';
  if (fs.existsSync(artifactDir)) {
    fs.writeFileSync(path.join(artifactDir, 'cif_intranet_aplicacion.html'), singleHtml);
  }

  console.log(`Single-file HTML generated: ${(singleHtml.length / 1024).toFixed(2)} KB`);
} catch (err) {
  console.error('Error bundling HTML:', err);
}
