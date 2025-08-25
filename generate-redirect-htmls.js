const fs = require('fs');
const path = require('path');

const linksPath = path.join(__dirname, 'public', 'links.json');
const publicDir = path.join(__dirname, 'public');

function makeRedirectHtml(keyword, url) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>Redirect: ${keyword}</title>
  <script>
    window.location.replace(${JSON.stringify(url)});
  </script>
</head>
<body>
  ${keyword}로 이동 중...
</body>
</html>
`;
}

function main() {
  const links = JSON.parse(fs.readFileSync(linksPath, 'utf8'));
  // public 폴더 내 기존 키워드 파일 목록 조회
  const files = fs.readdirSync(publicDir);
  const keywords = Object.keys(links);

  // links.json에 없는 키워드 파일은 삭제
  files.forEach(file => {
    // 확장자 없는 파일만 처리
    if (!path.extname(file) && !keywords.includes(file) && file !== 'index' && file !== 'links') {
      fs.unlinkSync(path.join(publicDir, file));
    }
  });

  // links.json에 있는 키워드 파일 생성/갱신
  Object.entries(links).forEach(([keyword, url]) => {
    const html = makeRedirectHtml(keyword, url);
    fs.writeFileSync(path.join(publicDir, `${keyword}`), html, 'utf8');
  });
  console.log('Redirect HTML files generated and obsolete files removed.');
}

main();
