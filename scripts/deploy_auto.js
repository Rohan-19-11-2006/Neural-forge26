// Automated Deployment & GoDaddy DNS Linking Engine
const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

async function deployToNetlify(token, siteId) {
  console.log('📦 Packaging website bundle...');
  const zipPath = path.join(__dirname, 'bundle.zip');
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  // Exclude unwanted files and zip the project folder
  execSync(`powershell -Command "Compress-Archive -Path 'index.html','about.html','tracks.html','schedule.html','rulebook.html','register.html','css','js','assets' -DestinationPath '${zipPath}' -Force"`);

  const zipBuffer = fs.readFileSync(zipPath);
  console.log(`📤 Uploading zip bundle (${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB) to Netlify site ${siteId}...`);

  const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/zip'
    },
    body: zipBuffer
  });

  const deployData = await deployRes.json();
  if (!deployRes.ok) {
    throw new Error('Netlify Deploy Failed: ' + JSON.stringify(deployData));
  }

  console.log('✅ Netlify Deployment Successful!');
  console.log('🌐 Live Netlify URL:', deployData.ssl_url || deployData.url);

  // Link custom domain neuralforge26.com to Netlify site
  console.log('🔗 Attaching neuralforge26.com to Netlify site...');
  const domainRes = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ custom_domain: 'neuralforge26.com' })
  });
  const domainData = await domainRes.json();
  console.log('✅ Custom domain configured in Netlify!');

  // Cleanup zip
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  return deployData;
}

async function deployToVercel(token) {
  console.log('📦 Preparing Vercel deployment via REST API...');
  
  // Read all project files
  const filesToDeploy = [];
  function addFiles(dir, base = '') {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      if (['node_modules', '.git', '.netlify', 'scripts'].includes(f)) continue;
      const full = path.join(dir, f);
      const rel = path.join(base, f).replace(/\\/g, '/');
      if (fs.statSync(full).isDirectory()) {
        addFiles(full, rel);
      } else {
        filesToDeploy.push({
          file: rel,
          data: fs.readFileSync(full).toString('base64'),
          encoding: 'base64'
        });
      }
    }
  }
  addFiles(path.join(__dirname, '..'));

  console.log(`📤 Uploading ${filesToDeploy.length} files to Vercel...`);
  const res = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'neuralforge26',
      files: filesToDeploy,
      projectSettings: { framework: null }
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error('Vercel Deploy Failed: ' + JSON.stringify(data));
  }
  console.log('✅ Vercel Deployment Successful!');
  console.log('🌐 Live Vercel URL:', 'https://' + data.url);

  // Link domain
  console.log('🔗 Attaching neuralforge26.com to Vercel...');
  await fetch(`https://api.vercel.com/v10/projects/${data.projectId}/domains`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'neuralforge26.com' })
  });
  console.log('✅ Custom domain attached in Vercel!');
  return data;
}

async function updateGoDaddyDns(key, secret, targetA, targetCname) {
  console.log('🔧 Updating GoDaddy DNS for neuralforge26.com via API...');
  const authHeader = `sso-key ${key}:${secret}`;

  // 1. Update A record (@)
  const aRes = await fetch('https://api.godaddy.com/v1/domains/neuralforge26.com/records/A/@', {
    method: 'PUT',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{ data: targetA, ttl: 600 }])
  });

  if (!aRes.ok) {
    const errText = await aRes.text();
    throw new Error('GoDaddy A record update failed: ' + errText);
  }
  console.log(`✅ GoDaddy A Record updated: @ -> ${targetA}`);

  // 2. Update CNAME record (www)
  const cnameRes = await fetch('https://api.godaddy.com/v1/domains/neuralforge26.com/records/CNAME/www', {
    method: 'PUT',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify([{ data: targetCname, ttl: 600 }])
  });

  if (!cnameRes.ok) {
    const errText = await cnameRes.text();
    throw new Error('GoDaddy CNAME record update failed: ' + errText);
  }
  console.log(`✅ GoDaddy CNAME Record updated: www -> ${targetCname}`);
  console.log('🎉 GoDaddy DNS is now officially configured and pointing to your live site!');
}

module.exports = { deployToNetlify, deployToVercel, updateGoDaddyDns };
