#!/usr/bin/env node

/**
 * Automated URL Replacement Script
 * This script replaces all hardcoded localhost:3001 URLs with the new API configuration
 */

const fs = require('fs');
const path = require('path');

// Files to update with their specific replacements
const filesToUpdate = [
  {
    file: 'app/(user)/register/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/auth/register'`,
        to: `API.auth.register()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/login/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/auth/login'`,
        to: `API.auth.login()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/auth/forgot-password/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/auth/forgot-password'`,
        to: `API.auth.forgotPassword()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/auth/reset-password/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/auth/reset-password'`,
        to: `API.auth.resetPassword()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/profile/edit/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/profile'`,
        to: `API.profile.get()`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/auth/resend-verification'`,
        to: `API.auth.resendVerification()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/dashboard/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/profile'`,
        to: `API.profile.get()`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/profile/lombas'`,
        to: `API.profile.lombas()`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/profile/beasiswas'`,
        to: `API.profile.beasiswas()`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/profile/talks'`,
        to: `API.profile.talks()`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/profile/bootcamps'`,
        to: `API.profile.bootcamps()`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/profile/picture'`,
        to: `API.profile.picture()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/bootcamp/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/bootcamps'`,
        to: `API.bootcamps.list()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/bootcamps\/\$\{bootcampId\}\/register`/g,
        to: `API.bootcamps.register(bootcampId)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/glory/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/lombas'`,
        to: `API.lombas.list()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/components/ProfileButton.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/profile'`,
        to: `API.profile.get()`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/components/NotificationDropdown.js',
    replacements: [
      {
        from: /`http:\/\/localhost:3001\/api\/notifications\?page=\$\{page\}&limit=5`/g,
        to: `API.notifications.list(page, 5)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/notifications\/\$\{id\}\/read`/g,
        to: `API.notifications.markRead(id)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/components/LombaDetailModal.js',
    replacements: [
      {
        from: /`http:\/\/localhost:3001\/api\/lombas\/\$\{lomba\.id\}\/register-solo`/g,
        to: `API.lombas.registerSolo(lomba.id)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/lombas\/\$\{lomba\.id\}\/create-team`/g,
        to: `API.lombas.createTeam(lomba.id)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/lombas\/\$\{lomba\.id\}\/join-team`/g,
        to: `API.lombas.joinTeam(lomba.id)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(user)/components/EventDetailModal.js',
    replacements: [
      {
        from: /`http:\/\/localhost:3001\/api\/events\/\$\{event\.type\}\/\$\{event\.id\}\/team`/g,
        to: `API.events.team(event.type, event.id)`,
        addImport: true
      }
    ]
  },
  // Admin pages
  {
    file: 'app/(admin)/admin/lombas/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/lombas'`,
        to: `API.lombas.list()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/lombas\/\$\{id\}`/g,
        to: `API.lombas.detail(id)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/lombas\/\$\{editingLomba\.id\}`/g,
        to: `API.lombas.detail(editingLomba.id)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(admin)/admin/beasiswas/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/beasiswas'`,
        to: `API.beasiswas.list()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/beasiswas\/\$\{id\}`/g,
        to: `API.beasiswas.detail(id)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/beasiswas\/\$\{editingBeasiswa\.id\}`/g,
        to: `API.beasiswas.detail(editingBeasiswa.id)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/beasiswas\/\$\{beasiswaId\}\/poster`/g,
        to: `API.beasiswas.poster(beasiswaId)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(admin)/admin/talks/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/talks'`,
        to: `API.talks.list()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/talks\/\$\{id\}`/g,
        to: `API.talks.detail(id)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/talks\/\$\{editingTalk\.id\}`/g,
        to: `API.talks.detail(editingTalk.id)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(admin)/admin/bootcamps/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/bootcamps'`,
        to: `API.bootcamps.list()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/bootcamps\/\$\{id\}`/g,
        to: `API.bootcamps.detail(id)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/bootcamps\/\$\{editingBootcamp\.id\}`/g,
        to: `API.bootcamps.detail(editingBootcamp.id)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(admin)/admin/members/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/users'`,
        to: `API.users.list()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/users\/\$\{nim\}`/g,
        to: `API.users.detail(nim)`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/users\/\$\{editingMember\.nim\}`/g,
        to: `API.users.update(editingMember.nim)`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/auth/register'`,
        to: `API.auth.register()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/users\/\$\{nim\}\/email`/g,
        to: `API.users.email(nim)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(admin)/admin/notifications/page.js',
    replacements: [
      {
        from: `'http://localhost:3001/api/notifications?limit=1000'`,
        to: `API.notifications.list(1, 1000)`,
        addImport: true
      },
      {
        from: `'http://localhost:3001/api/notifications'`,
        to: `API.notifications.create()`,
        addImport: true
      },
      {
        from: /`http:\/\/localhost:3001\/api\/notifications\/\$\{id\}`/g,
        to: `API.notifications.delete(id)`,
        addImport: true
      }
    ]
  },
  {
    file: 'app/(admin)/admin/components/MemberDetailModal.js',
    replacements: [
      {
        from: /`http:\/\/localhost:3001\/api\/users\/\$\{nim\}\/details`/g,
        to: `API.users.details(nim)`,
        addImport: true
      }
    ]
  }
];

const frontendDir = path.join(__dirname);
const importStatement = `import API from '@/lib/api';\n`;

console.log('🚀 Starting automated URL replacement...\n');

let totalReplacements = 0;
let filesUpdated = 0;

filesToUpdate.forEach(({ file, replacements }) => {
  const filePath = path.join(frontendDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let fileModified = false;
  let needsImport = false;
  
  replacements.forEach(({ from, to, addImport }) => {
    const originalContent = content;
    
    if (from instanceof RegExp) {
      content = content.replace(from, to);
    } else {
      content = content.split(from).join(to);
    }
    
    if (content !== originalContent) {
      fileModified = true;
      totalReplacements++;
      if (addImport) needsImport = true;
    }
  });
  
  // Add import if needed and not already present
  if (needsImport && !content.includes("import API from '@/lib/api'")) {
    // Find the last import statement
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim().startsWith("import{")) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, importStatement.trim());
      content = lines.join('\n');
    } else {
      // No imports found, add at the beginning after 'use client' if present
      if (content.includes("'use client'")) {
        content = content.replace("'use client';", `'use client';\n${importStatement}`);
      } else {
        content = importStatement + content;
      }
    }
  }
  
  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`✅ Updated: ${file}`);
  }
});

console.log(`\n✨ Replacement complete!`);
console.log(`📊 Stats:`);
console.log(`   - Files updated: ${filesUpdated}`);
console.log(`   - Total replacements: ${totalReplacements}`);
console.log(`\n🎯 Next steps:`);
console.log(`   1. Review the changes with: git diff`);
console.log(`   2. Test locally: npm run dev`);
console.log(`   3. Update .env.production with your Railway URL`);
console.log(`   4. Deploy to Vercel`);
