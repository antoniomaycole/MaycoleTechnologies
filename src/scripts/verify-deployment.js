#!/usr/bin/env node

/**
 * MaycoleTechnologies™ Deployment Verification Script
 * 
 * Performs comprehensive pre-deployment checks to ensure the website
 * meets Oracle-level professional standards.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 MaycoleTechnologies™ Deployment Verification');
console.log('================================================\n');

let hasErrors = false;
let hasWarnings = false;

function logError(message) {
  console.error('❌ ERROR:', message);
  hasErrors = true;
}

function logWarning(message) {
  console.warn('⚠️  WARNING:', message);
  hasWarnings = true;
}

function logSuccess(message) {
  console.log('✅ SUCCESS:', message);
}

function logInfo(message) {
  console.log('ℹ️  INFO:', message);
}

// Check if essential files exist
const essentialFiles = [
  'index.html',
  'App.tsx',
  'main.tsx',
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'styles/globals.css',
  'public/atomic-favicon.svg',
  'components/index.ts',
  'components/MainSections.tsx'
];

console.log('📁 Checking Essential Files...');
essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    logSuccess(`${file} exists`);
  } else {
    logError(`${file} is missing`);
  }
});

// Check for junk files that should be cleaned up
console.log('\n🧹 Checking for Junk Files...');
const junkPatterns = [
  /.*\.backup$/,
  /.*\.bak$/,
  /.*\.old$/,
  /.*\.tmp$/,
  /CLEANUP_.*\.md$/,
  /.*_TEMP\.md$/,
  /TempCleanupApp\.tsx$/
];

function checkDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        if (item !== 'node_modules' && item !== '.git' && item !== 'dist') {
          checkDirectory(fullPath);
        }
      } else {
        junkPatterns.forEach(pattern => {
          if (pattern.test(item)) {
            logWarning(`Junk file detected: ${fullPath}`);
          }
        });
      }
    });
  } catch (error) {
    // Ignore directories we can't read
  }
}

checkDirectory('.');

// Check package.json for required dependencies
console.log('\n📦 Checking Dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    'react',
    'react-dom',
    'motion',
    'lucide-react',
    'tailwindcss'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      logSuccess(`${dep} is installed`);
    } else {
      logError(`${dep} is missing from dependencies`);
    }
  });
  
  // Check if brand information is correct
  if (packageJson.description?.includes('MaycoleTechnologies™')) {
    logSuccess('Package description includes brand name');
  } else {
    logWarning('Package description should include MaycoleTechnologies™');
  }
  
  // Check if tagline is correct
  if (packageJson.description?.includes('Changing The Future One Product At A Time')) {
    logSuccess('Package description includes correct tagline');
  } else {
    logWarning('Package description should include "Changing The Future One Product At A Time"');
  }
  
} catch (error) {
  logError('Could not read package.json');
}

// Check main App.tsx structure
console.log('\n🏗️  Checking App Structure...');
try {
  const appContent = fs.readFileSync('App.tsx', 'utf8');
  
  if (appContent.includes('MaycoleTechnologies') || appContent.includes('MainSections')) {
    logSuccess('App contains proper structure');
  } else {
    logWarning('App should contain MaycoleTechnologies branding or MainSections');
  }
  
  if (appContent.includes('Header') && appContent.includes('Footer')) {
    logSuccess('App has proper layout structure');
  } else {
    logError('App missing Header or Footer components');
  }
  
  if (appContent.includes('Toaster')) {
    logSuccess('Toast notifications are configured');
  } else {
    logWarning('Consider adding toast notifications');
  }

  if (appContent.includes('maycole-app-bg')) {
    logSuccess('App uses brand-specific background class');
  } else {
    logWarning('App should use maycole-app-bg class for consistent styling');
  }
  
} catch (error) {
  logError('Could not read App.tsx');
}

// Check CSS configuration
console.log('\n🎨 Checking Styles Configuration...');
try {
  const cssContent = fs.readFileSync('styles/globals.css', 'utf8');
  
  if (cssContent.includes('--maycole-green') && cssContent.includes('--maycole-gold')) {
    logSuccess('Brand colors are defined in CSS');
  } else {
    logError('Brand colors missing from CSS variables');
  }
  
  if (cssContent.includes('@import \'tailwindcss/base\'')) {
    logSuccess('Tailwind CSS is properly imported');
  } else {
    logError('Tailwind CSS imports are missing');
  }

  if (cssContent.includes('.maycole-section-about') && cssContent.includes('#1a1a1a')) {
    logSuccess('Section background colors are properly configured');
  } else {
    logWarning('Section background colors may not be properly configured');
  }
  
} catch (error) {
  logError('Could not read styles/globals.css');
}

// Check component organization
console.log('\n🧩 Checking Component Organization...');
try {
  const componentsIndex = fs.readFileSync('components/index.ts', 'utf8');
  
  if (componentsIndex.includes('MainSections') && componentsIndex.includes('AtomicLogo')) {
    logSuccess('Components are properly exported from index');
  } else {
    logWarning('Component exports could be improved in components/index.ts');
  }
  
} catch (error) {
  logWarning('components/index.ts not found - consider creating for better organization');
}

// Check for environment configuration
console.log('\n🔧 Checking Environment Configuration...');
if (fs.existsSync('.env.example')) {
  logSuccess('.env.example exists for deployment configuration');
} else {
  logWarning('.env.example should be provided for deployment');
}

if (fs.existsSync('netlify.toml') || fs.existsSync('vercel.json')) {
  logSuccess('Deployment configuration found');
} else {
  logWarning('Consider adding deployment configuration (netlify.toml or vercel.json)');
}

// Check TypeScript configuration
console.log('\n📝 Checking TypeScript Configuration...');
try {
  const tsconfigContent = fs.readFileSync('tsconfig.json', 'utf8');
  const tsconfig = JSON.parse(tsconfigContent);
  
  if (tsconfig.compilerOptions?.strict) {
    logSuccess('TypeScript strict mode is enabled');
  } else {
    logWarning('Consider enabling TypeScript strict mode');
  }
  
} catch (error) {
  logError('Could not read tsconfig.json');
}

// Check for proper file structure
console.log('\n📂 Checking File Structure...');
const requiredDirectories = ['components', 'styles', 'public'];
requiredDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    logSuccess(`${dir}/ directory exists`);
  } else {
    logError(`${dir}/ directory is missing`);
  }
});

// Check if misplaced config files exist
const misplacedFiles = ['settings.json', 'launch.json', 'tasks.json', 'extensions.json', 'workflows/ci.yml'];
misplacedFiles.forEach(file => {
  if (fs.existsSync(file)) {
    logWarning(`Misplaced config file: ${file} (should be in .vscode/ or .github/)`);
  } else {
    logSuccess(`No misplaced ${file} found`);
  }
});

// Final deployment readiness check
console.log('\n🎯 Deployment Readiness Summary');
console.log('================================');

if (hasErrors) {
  console.log('❌ DEPLOYMENT NOT READY - Please fix errors above');
  logInfo('The website has critical issues that must be resolved before deployment.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  DEPLOYMENT READY WITH WARNINGS');
  logInfo('The website is functional but could be improved. Consider addressing warnings.');
  logInfo('You may proceed with deployment, but review the warnings above.');
} else {
  console.log('✅ DEPLOYMENT READY');
  logInfo('MaycoleTechnologies™ website is ready for professional deployment!');
  logInfo('All checks passed successfully. Ready for Oracle-level presentation.');
}

console.log('\n🏢 MaycoleTechnologies™ - Changing The Future One Product At A Time');
console.log('   Professional website verification complete.\n');