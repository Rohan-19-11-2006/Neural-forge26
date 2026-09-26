const { deployToNetlify, deployToVercel, updateGoDaddyDns } = require('./deploy_auto');

async function main() {
  const netlifyToken = process.env.NETLIFY_TOKEN;
  const vercelToken = process.env.VERCEL_TOKEN;
  const godaddyKey = process.env.GODADDY_KEY;
  const godaddySecret = process.env.GODADDY_SECRET;

  if (!netlifyToken && !vercelToken) {
    console.error('❌ Please provide either NETLIFY_TOKEN or VERCEL_TOKEN.');
    process.exit(1);
  }

  let targetA = '75.2.60.5';
  let targetCname = 'tubular-licorice-31cbd6.netlify.app';

  if (netlifyToken) {
    const siteId = 'f655b232-9cf2-4b28-af2d-e36fa7ddf60c';
    await deployToNetlify(netlifyToken, siteId);
  } else if (vercelToken) {
    targetA = '76.76.21.21';
    targetCname = 'cname.vercel-dns.com';
    await deployToVercel(vercelToken);
  }

  if (godaddyKey && godaddySecret) {
    await updateGoDaddyDns(godaddyKey, godaddySecret, targetA, targetCname);
  } else {
    console.log('\n⚠️ No GoDaddy API credentials provided. GoDaddy DNS was not updated automatically.');
  }
}

main().catch(err => {
  console.error('\n❌ Deployment script error:', err.message);
  process.exit(1);
});
